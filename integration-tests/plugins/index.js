const auth = require('../mockApis/auth')
const { cypressConfigResolver } = require('../config/cypress-config-resolver')
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = (on) => {
  on('task', {
    getLoginUrl: auth.getLoginUrl,
    stubLogin: () => auth.stubLogin({}),
    log(message) {
      console.log(message)

      return null
    },
    table(message) {
      console.table(message)

      return null
    }
  })

  on('file:preprocessor', cucumber())
  return cypressConfigResolver()
}
