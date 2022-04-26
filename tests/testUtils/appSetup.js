const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const path = require('path')
const nunjucksSetup = require('../../server/utils/nunjucksSetup')

module.exports = route => {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)

  app.use(cookieSession({ keys: [''] }))

  app.use((req, res, next) => {
    req.redisClient = {
      getAsync: () => {},
      setAsync: () => {}
    }
    req.user = {
      firstName: 'first',
      lastName: 'last',
      userId: 'id',
      token: 'token',
      username: 'CA_USER_TEST'
    }
    res.locals.user = { token: 'ABCDEF', username: 'me' }
    next()
  })
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/', route)
  app.use(error => console.log(error))
  return app
}
