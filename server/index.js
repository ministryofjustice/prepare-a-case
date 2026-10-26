// Initialise OpenTelemetry before loading Express, HTTP clients or Bunyan so
// their modules can be instrumented when they are first required.
const appInsightsClient = require('./utils/azure-appinsights')

const createApp = require('./app')
const createSignInService = require('./authentication/signInService')

require('./services/eventPublisher')(appInsightsClient)

const app = createApp({
  signInService: createSignInService()
})

module.exports = app
