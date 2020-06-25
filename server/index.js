const createApp = require('../app')
const authClientBuilder = require('./data/authClientBuilder')
const createSignInService = require('./authentication/signInService')
const createUserService = require('./services/userService')

const userService = createUserService(authClientBuilder)

const app = createApp({
  signInService: createSignInService(),
  userService
})

module.exports = app
