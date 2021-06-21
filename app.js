const axios = require('axios')
const { Service } = require('axios-middleware')
const config = require('./config')
const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const helmet = require('helmet')
const path = require('path')
const passport = require('passport')
const createRouter = require('./server/routes')
const createAttachmentsRouter = require('./server/routes/attachments')
const healthcheckFactory = require('./server/services/healthcheck')
const auth = require('./server/authentication/auth')
const populateCurrentUser = require('./server/routes/middleware/populateCurrentUser')
const authorisationMiddleware = require('./server/routes/middleware/authorisationMiddleware')
const errorHandler = require('./server/errorHandler')
const log = require('./log')
const nunjucksSetup = require('./server/utils/nunjucksSetup')
const nodeVersion = process.version
const os = require('os')
const hostName = os.hostname()

const { authenticationMiddleware } = auth

module.exports = function createApp ({ signInService, userService }) {
  const service = new Service(axios)
  const app = express()

  console.info(`Starting Prepare a Case using NodeJS ${nodeVersion} on ${hostName}`)

  auth.init(signInService)

  nunjucksSetup(app, path)

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true)

  app.set('view engine', 'njk')

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          '\'self\'',
          'https://www.google-analytics.com',
          'www.google-analytics.com'
        ],
        objectSrc: ['\'none\''],
        scriptSrc: [
          '\'self\'',
          'www.google-analytics.com',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          '\'sha256-6cE0E4X9g7PbRlMR/+GoyLM4W7mjVxZL4H6E8FgY8OA=\'',
          '\'sha256-l1eTVSK8DTnK8+yloud7wZUqFrI0atVo6VlC6PJvYaQ=\'',
          '\'sha256-Ex+PXm59nVbu/S+FH/u8FLio5zO5YfFPo0/jH0uw19k=\'',
          '\'sha256-QIG/FBh5vORMkpviiAyUOvMgp6XvwQIEagSXO2FUmyo=\'',
          `'nonce-${config.nonce}'`
        ],
        imgSrc: [
          '\'self\'',
          'https://www.google-analytics.com',
          'www.google-analytics.com'
        ],
        upgradeInsecureRequests: [],
        connectSrc: [
          '\'self\'',
          'www.google-analytics.com',
          'https://www.google-analytics.com'
        ]
      }
    }
  }))

  const client = redis.createClient({
    port: config.redis.port,
    password: config.redis.password,
    host: config.redis.host,
    tls: config.redis.tls_enabled === 'true' ? {} : false
  })

  app.use(
    session({
      store: new RedisStore({ client }),
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiry * 60 * 1000 },
      secret: config.session.secret,
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true
    })
  )

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/assets', [
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'), { maxage : '30d' }),
    express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/assets'), { maxage : '30d' }),
    express.static(path.join(__dirname, '/node_modules/accessible-autocomplete/dist'), { maxage : '30d' })
  ])
  app.use('/moj', express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj'), { maxage : '30d' }))
  app.use('/govuk', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk'), { maxage : '30d' }))
  app.use(express.static(path.join(__dirname, 'public'), { maxage : '30d' }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store')
    res.setHeader('Pragma', 'no-cache')
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    const startTime = new Date()
    log.info({
      req: {
        url: req.url,
        method: req.method,
        protocol: req.protocol,
        requestId: req.requestId
      }
    })
    res.on('finish', function () {
      res.responseTime = new Date() - startTime
      res.requestId = req.requestId
      log.info({
        res: {
          statusCode: res.statusCode,
          requestId: res.requestId,
          responseTime: res.responseTime
        }
      })
    })
    next()
  })

  app.use(compression())

  function addTemplateVariables (req, res, next) {
    res.locals.user = req.user
    next()
  }

  app.use(addTemplateVariables)

  const healthcheck = healthcheckFactory(config.apis.oauth2.url, config.apis.courtCaseService.url, config.apis.userPreferenceService.url)

  app.get('/health', (req, res, next) => {
    healthcheck((err, result) => {
      if (err) {
        return next(err)
      }
      if (!result.healthy) {
        res.status(503)
      }
      res.json(result)
      return result
    })
  })

  // JWT token refresh
  app.use(async (req, res, next) => {
    let axiosHeaders = {}
    if (req.user && req.originalUrl !== '/logout') {
      const timeToRefresh = new Date() > req.user.refreshTime
      if (timeToRefresh) {
        try {
          const newToken = await signInService.getRefreshedToken(req.user)
          req.user.token = newToken.token
          req.user.refreshToken = newToken.refreshToken
          log.info(`existing refreshTime in the past by ${new Date().getTime() - req.user.refreshTime}`)
          log.info(
            `updating time by ${newToken.refreshTime - req.user.refreshTime} from ${req.user.refreshTime} to ${
              newToken.refreshTime
            }`
          )
          req.user.refreshTime = newToken.refreshTime
        } catch (error) {
          log.error(`Token refresh error: ${req.user.username}`, error.stack)
          return res.redirect('/logout')
        }
      }

      axiosHeaders = {
        Authorization: `Bearer ${req.user.token}`
      }
    }
    service.reset()
    service.register({
      onRequest (config) {
        config.headers = {
          ...config.headers,
          ...axiosHeaders
        }
        return config
      }
    })
    return next()
  })

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  app.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  const authLogoutUrl = `${config.apis.oauth2.url}/logout?client_id=${config.apis.oauth2.apiClientId}&redirect_uri=${config.domain}`

  app.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('error', {
      status: 401,
      authURL: authLogoutUrl
    })
  })

  app.get('/login', passport.authenticate('oauth2'))

  app.get('/login/callback', (req, res, next) =>
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror'
    })(req, res, next)
  )

  app.use('/logout', (req, res) => {
    if (req.user) {
      req.logout()
      req.session.destroy()
    }
    res.redirect(authLogoutUrl)
  })

  const currentUserInContext = populateCurrentUser(userService)
  app.use(currentUserInContext)

  app.use(authorisationMiddleware)

  app.use(
    '/',
    createRouter({
      authenticationMiddleware
    })
  )

  app.use(
    '/:courtCode/attachments',
    createAttachmentsRouter({
      authenticationMiddleware
    })
  )

  app.use(errorHandler.notFound)

  if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler.developmentErrors)
  }

  app.use(errorHandler.productionErrors)

  return app
}
