const fs = require('fs')
const axios = require('axios').default
const { promisify } = require('util')
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
const createRouter = require('./routes')
const createAttachmentsRouter = require('./routes/attachments')
const healthcheckFactory = require('./services/healthcheck')
const auth = require('./authentication/auth')
const authorisationMiddleware = require('./routes/middleware/authorisationMiddleware')
const errorHandler = require('./errorHandler')
const log = require('./log')
const nunjucksSetup = require('./utils/nunjucksSetup')
const flash = require('./middleware/flash')
const nodeVersion = process.version
const os = require('os')
const hostName = os.hostname()

const { authenticationMiddleware } = auth
const catchErrors = require('./routes/handlers/catchAsyncErrors')

module.exports = function createApp ({ signInService }) {
  const service = new Service(axios)
  const app = express()

  if (!config.settings.reduceStdoutNoise) {
    const data = fs.readFileSync(path.join(__dirname, 'banner.txt'), 'utf8')
    console.log(data.toString())
    console.info(`Starting Prepare a Case ${config.appVersion} using NodeJS ${nodeVersion} on ${hostName}`)
  }

  auth.init(signInService)

  nunjucksSetup(app, path)

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true)

  app.set('view engine', 'njk')

  app.use(express.static(path.join(__dirname, '../public/build'), { maxage: config.settings.assetCache }))

  if (config.maintenanceModeEnabled) {
    const router = express.Router()
    const filePath = path.join(__dirname, 'public', 'maintenance.html')

    router.use(async (req, res, next) => {
      res.sendFile(filePath)
    })

    app.use('/**', router)
    return app
  }

  app.use((req, res, next) => {
    res.locals.nonce = config.nonce()
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [
            '\'self\'',
            'https://www.google-analytics.com',
            'www.google-analytics.com'
          ],
          objectSrc: ['\'none\''],
          frameSrc: ['https://www.youtube.com', '\'self\''],
          styleSrc: ['\'self\'', '\'unsafe-inline\''],
          scriptSrc: [
            '\'self\'',
            '\'unsafe-eval\'',
            'www.google-analytics.com',
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
            'js.monitor.azure.com',
            '\'sha256-6cE0E4X9g7PbRlMR/+GoyLM4W7mjVxZL4H6E8FgY8OA=\'',
            '\'sha256-l1eTVSK8DTnK8+yloud7wZUqFrI0atVo6VlC6PJvYaQ=\'',
            '\'sha256-Ex+PXm59nVbu/S+FH/u8FLio5zO5YfFPo0/jH0uw19k=\'',
            '\'sha256-QIG/FBh5vORMkpviiAyUOvMgp6XvwQIEagSXO2FUmyo=\'',
            `'nonce-${res.locals.nonce}'`
          ],
          imgSrc: [
            '\'self\'',
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'www.google-analytics.com'
          ],
          upgradeInsecureRequests: [],
          connectSrc: [
            '\'self\'',
            'www.google-analytics.com',
            'https://www.google-analytics.com',
            'js.monitor.azure.com',
            'dc.services.visualstudio.com'
          ]
        }
      }
    })(req, res, next)
  })

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

  app.use(flash())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/assets', [
    express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk/assets'), { maxage: config.settings.assetCache }),
    express.static(path.join(__dirname, '../node_modules/@ministryofjustice/frontend/moj/assets'), { maxage: config.settings.assetCache }),
    express.static(path.join(__dirname, '../node_modules/accessible-autocomplete/dist'), { maxage: config.settings.assetCache })
  ])
  app.use('/moj', express.static(path.join(__dirname, '../node_modules/@ministryofjustice/frontend/moj'), { maxage: config.settings.scriptCache }))
  app.use('/govuk', express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk'), { maxage: config.settings.scriptCache }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store')
    res.setHeader('Pragma', 'no-cache')
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    res.locals.appVersion = config.appVersion
    req.redisClient = {
      getAsync: promisify(client.get).bind(client),
      setAsync: promisify(client.set).bind(client)
    }
    const startTime = new Date()
    if (!config.settings.reduceStdoutNoise) {
      log.info({
        req: {
          url: req.url,
          method: req.method,
          protocol: req.protocol,
          requestId: req.requestId
        }
      })
    }
    res.on('finish', function () {
      if (!config.settings.reduceStdoutNoise && res.statusCode < 400) {
        res.responseTime = new Date() - startTime
        res.requestId = req.requestId
        log.info({
          res: {
            statusCode: res.statusCode,
            requestId: res.requestId,
            responseTime: res.responseTime
          }
        })
      }
    })
    next()
  })

  app.use(compression())

  function addTemplateVariables (req, res, next) {
    res.locals.user = req.user
    next()
  }

  app.use(addTemplateVariables)

  // reduce noise during dev
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
      if (req.user.refreshTime && new Date() > req.user.refreshTime) {
        try {
          const newToken = await signInService.getRefreshedToken(req.user)
          req.user.token = newToken.token
          req.user.refreshToken = newToken.refreshToken
          if (!config.settings.reduceStdoutNoise) {
            log.info(`existing refreshTime in the past by ${new Date().getTime() - req.user.refreshTime}`)
            log.info(
              `updating time by ${newToken.refreshTime - req.user.refreshTime} from ${req.user.refreshTime} to ${
                newToken.refreshTime
              }`
            )
          }
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

  const authLogoutUrl = `${config.apis.oauth2.redirect}/logout?client_id=${config.apis.oauth2.apiClientId}&redirect_uri=${config.domain}`

  app.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('error', {
      status: 401,
      authURL: authLogoutUrl
    })
  })

  app.get('/login', passport.authenticate('oauth2'))

  app.get('/login/callback', (req, res, next) => passport.authenticate('oauth2', {
    successReturnToOrRedirect: req.session.returnTo || '/',
    failureRedirect: '/autherror'
  })(req, res, next))

  app.use('/logout', catchErrors((req, res, next) => {
    if (req.user) {
      req.logout(err => {
        if (err) {
          log.error('Error during logout', err)
          return next(err)
        }
      })
    }
    res.redirect(authLogoutUrl)
  }))

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
