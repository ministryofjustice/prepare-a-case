const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const nunjucks = require('nunjucks')
const sassMiddleware = require('node-sass-middleware')
const viewRouter = require('./routes/view')
const apiRouter = require('./routes/api')
const moment = require('moment')

const app = express()
const shortDateFormat = 'YYYY-MM-DD'
const longDateFormat = 'dddd, D MMMM YYYY'

const env = nunjucks.configure([
  path.join(__dirname, '/node_modules/govuk-frontend/'),
  path.join(__dirname, '/node_modules/@ministryofjustice/frontend/'),
  path.join(__dirname, '/views')
], {
  autoescape: true,
  express: app,
  watch: true
})

env.addGlobal('today', moment().format(shortDateFormat))
env.addGlobal('tomorrow', moment().add(1, 'days').format(shortDateFormat))
env.addGlobal('dayAfter', moment().add(2, 'days').format(shortDateFormat))
env.addGlobal('todayLong', moment(env.getGlobal('today')).format(longDateFormat))
env.addGlobal('tomorrowLong', moment(env.getGlobal('tomorrow')).format(longDateFormat))
env.addGlobal('dayAfterLong', moment(env.getGlobal('dayAfter')).format(longDateFormat))

app.set('view engine', 'njk')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true
}))
app.use('/assets', [
  express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')),
  express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/assets'))
])
app.use('/govuk', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', viewRouter)
app.use('/ping', apiRouter)

module.exports = app
