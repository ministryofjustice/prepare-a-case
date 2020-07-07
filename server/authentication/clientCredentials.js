const config = require('../../config')

module.exports = {
  generateOauthClientToken
}

function generateOauthClientToken (
  clientId = config.apis.oauth2.apiClientId,
  clientSecret = config.apis.oauth2.apiClientSecret
) {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}
