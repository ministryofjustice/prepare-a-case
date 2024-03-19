// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
const appInsightsClient = require('./utils/azure-appinsights')

const createApp = require('./app')
const createSignInService = require('./authentication/signInService')

require('./services/eventPublisher')(appInsightsClient)

const app = createApp({
  signInService: createSignInService()
})

module.exports = app
