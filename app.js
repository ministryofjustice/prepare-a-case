const express = require('express')
const compression = require('compression')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const nunjucks = require('nunjucks')
const session = require('express-session')
const helmet = require('helmet')
const attachmentsRouter = require('./routes/attachments')
const apiRouter = require('./routes/api')
const viewRouter = require('./routes/view')
const MemoryStore = require('memorystore')(session)
const hstsMaxAge = 604800 // @TODO: PIC-454 - Change to 31536000 (1 year) once confident that HSTS is working
const sessionExpiry = 12 * 60 * 60 * 1000 // 12hrs
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

env.addFilter('limit', function (arr, limit) {
  return arr.slice(0, limit)
})

app.set('view engine', 'njk')

app.use(helmet({
  hsts: {
    maxAge: hstsMaxAge
  }
}))

app.use(compression())
app.use(session({
  cookie: { maxAge: sessionExpiry },
  store: new MemoryStore({
    checkPeriod: sessionExpiry
  }),
  secret: process.env.SESSION_SECRET || 'prepare-a-case',
  resave: true,
  saveUninitialized: true
}))
app.use(logger('dev'))
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
app.use('/', viewRouter)
app.use('/attachments', attachmentsRouter)
app.use('/ping', apiRouter)

module.exports = app
