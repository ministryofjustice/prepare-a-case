const auth = require('../mockApis/auth')
const { cypressConfigResolver } = require('../config/cypress-config-resolver')
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = (on) => {
  on('task', {
    getLoginUrl: auth.getLoginUrl,
    stubLogin: () => auth.stubLogin({})
  })

  on('file:preprocessor', cucumber())
  return cypressConfigResolver()
}
