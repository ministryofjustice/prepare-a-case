// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
const appInsightsClient = require('./utils/azure-appinsights')

const createApp = require('../app')
const authClientBuilder = require('./data/authClientBuilder')
const createSignInService = require('./authentication/signInService')
const createUserService = require('./services/userService')

// eslint-disable-next-line no-unused-vars
const eventPublisher = require('./services/eventPublisher')(appInsightsClient)

const userService = createUserService(authClientBuilder)

const app = createApp({
  signInService: createSignInService(),
  userService
})

module.exports = app
