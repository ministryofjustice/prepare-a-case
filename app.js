const express = require('express')
const compression = require('compression')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const nunjucks = require('nunjucks')
const sassMiddleware = require('node-sass-middleware')
const session = require('express-session')
const viewRouter = require('./routes/view')
const apiRouter = require('./routes/api')
const redis = require('redis')

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

const app = express()

const env = nunjucks.configure([
  path.join(__dirname, '/node_modules/govuk-frontend/'),
  path.join(__dirname, '/node_modules/@ministryofjustice/frontend/'),
  path.join(__dirname, '/views')
], {
  autoescape: true,
  express: app,
  watch: process.env.WATCH_TEMPLATES
})

env.addFilter('json', function (value) {
  return JSON.parse(value)
})

app.set('view engine', 'njk')

app.use(compression())
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'prepare-a-case',
  resave: true,
  saveUninitialized: true
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed',
  sourceMap: true
}))
app.use('/assets', [
  express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')),
  express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/assets'))
])
app.use('/moj', express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj')))
app.use('/govuk', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', viewRouter)
app.use('/ping', apiRouter)

module.exports = app
