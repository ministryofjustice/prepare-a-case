const express = require('express')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const asyncMiddleware = require('./asyncMiddleware')

const CreateHomeRoutes = require('./home')

module.exports = function Index ({ authenticationMiddleware }) {
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
  const get = (path, handler) => router.get(path, asyncMiddleware(handler))

  get('/', home.index)

  return router
}
