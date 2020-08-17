const axios = require('axios')
const { Service } = require('axios-middleware')
const config = require('./config')
const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const nunjucks = require('nunjucks')
const session = require('express-session')
const loggingSerialiser = require('./server/loggingSerialiser')
const log = require('bunyan-request-logger')({
  name: 'Prepare a Case',
  serializers: loggingSerialiser
})
const helmet = require('helmet')
const path = require('path')
const MemoryStore = require('memorystore')(session)
const sessionExpiry = config.session.expiry * 60 * 1000
const passport = require('passport')
const createRouter = require('./server/routes')
const createAttachmentsRouter = require('./server/routes/attachments')
const healthcheckFactory = require('./server/services/healthcheck')
const auth = require('./server/authentication/auth')
const populateCurrentUser = require('./server/routes/middleware/populateCurrentUser')
const authorisationMiddleware = require('./server/routes/middleware/authorisationMiddleware')
const errorHandler = require('./server/errorHandler')

const { authenticationMiddleware } = auth

module.exports = function createApp ({ signInService, userService }) {
  const service = new Service(axios)
  const app = express()

  auth.init(signInService)

  const env = nunjucks.configure([
    path.join(__dirname, '/node_modules/govuk-frontend/'),
    path.join(__dirname, '/node_modules/@ministryofjustice/frontend/'),
    path.join(__dirname, '/server/views')
  ], {
    autoescape: true,
    express: app,
    watch: process.env.WATCH_TEMPLATES
  })

  env.addFilter('json', function (value) {
    return JSON.parse(value)
  })

  env.addFilter('limit', function (arr, limit) {
    return arr.slice(0, limit)
  })

  app.set('view engine', 'njk')

  app.use(helmet({
    contentSecurityPolicy: false
  }))
  app.use(compression())
  app.use(session({
    cookie: { maxAge: sessionExpiry },
    store: new MemoryStore({
      checkPeriod: sessionExpiry
    }),
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/assets', [
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')),
    express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/assets'))
  ])
  app.use('/moj', express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj')))
  app.use('/govuk', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')))
  app.use(express.static(path.join(__dirname, 'public')))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(log.requestLogger())

  function addTemplateVariables (req, res, next) {
    res.locals.user = req.user
    next()
  }

  app.use(addTemplateVariables)

  const healthcheck = healthcheckFactory(config.apis.oauth2.url, config.apis.courtCaseService.url)

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

  app.use(async (req, res, next) => {
    let axiosHeaders = {}
    if (req.user && req.originalUrl !== '/logout') {
      const timeToRefresh = new Date() > req.user.refreshTime
      if (timeToRefresh) {
        res.redirect('/logout')
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
    return res.render('autherror', {
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
    '/attachments',
    createAttachmentsRouter({
      authenticationMiddleware
    })
  )

  app.use((req, res, next) => {
    next(new Error('Not found'))
  })

  app.use(errorHandler)

  return app
}
