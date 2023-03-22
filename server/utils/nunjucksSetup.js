const nunjucks = require('nunjucks')
const { googleAnalyticsKey, instrumentationKey } = require('../../config')
const filters = require('./nunjucksFilters')

module.exports = (app, path) => {
  const env = nunjucks.configure([
    path.join(__dirname, '../../node_modules/govuk-frontend/'),
    path.join(__dirname, '../../node_modules/@ministryofjustice/frontend/'),
    path.join(__dirname, '../../server/views')
  ], {
    autoescape: true,
    express: app,
    watch: process.env.WATCH_TEMPLATES
  })

  Object.entries(filters)
    .forEach(([name, filter]) => env.addFilter(name, filter))

  env.addGlobal('googleAnalyticsKey', googleAnalyticsKey)
  env.addGlobal('instrumentationKey', instrumentationKey)
}
