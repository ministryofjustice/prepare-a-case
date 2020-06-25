const express = require('express')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const asyncMiddleware = require('./asyncMiddleware')

const CreateHomeRoutes = require('./home')

// eslint-disable-next-line no-unused-vars
module.exports = function Index({ authenticationMiddleware }) {
  const router = express.Router()

  router.use(authenticationMiddleware())
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(flash())

  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })

  const home = CreateHomeRoutes()

  // eslint-disable-next-line no-unused-vars
  const get = (path, handler) => router.get(path, asyncMiddleware(handler))
  // eslint-disable-next-line no-unused-vars
  const post = (path, handler) => router.post(path, asyncMiddleware(handler))

  get('/', home.index)

  return router
}
