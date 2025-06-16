const passport = require('passport')
const { Strategy } = require('passport-oauth2')
const config = require('../config')
const { env } = require('process')
const { generateOauthClientToken } = require('./clientCredentials')
const trackEvent = require('../utils/analytics')

function authenticationMiddleware () {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/login')
  }
}

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

function init (signInService) {
    console.log("in the passport strategy the auth url is", config.apis.oauth2.redirect)
  passport.use(new Strategy(
    {
      authorizationURL: `${config.apis.oauth2.redirect}/oauth/authorize`,
      tokenURL: `http://host.docker.internal/auth/oauth/token`,
      clientID: config.apis.oauth2.apiClientId,
      clientSecret: config.apis.oauth2.apiClientSecret,
      callbackURL: `${config.domain}/login/callback`,
      state: env.NOMIS_DISABLE_OAUTH_STATE !== 'true',
      accessType: 'offline',
      customHeaders: { Authorization: generateOauthClientToken() }
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const user = signInService.getUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obiBzbWl0aCIsInVzZXJfbmFtZSI6IlVTRVIxIiwic2NvcGUiOlsicmVhZCJdLCJhdXRoX3NvdXJjZSI6Im5vbWlzIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9QUkVQQVJFX0FfQ0FTRSJdLCJqdGkiOiI4M2I1MGExMC1jY2E2LTQxZGItOTg1Zi1lODdlZmIzMDNkZGIiLCJjbGllbnRfaWQiOiJjbGllbnRpZCIsImlhdCI6MTc0OTkwNTQ2NywiZXhwIjoxNzQ5OTA5MDY3fQ.2q3XsbflzLbSfVjdXniWZn7QtrMaBWVevYLZJ2Y7v8w", refreshToken, profile.expires_in, profile.user_name)
        return done(null, user)
      } catch (err) {
        trackEvent('PiCsignInServiceError', err)
        return done(err, null)
      }
    }
  ))
}

module.exports.init = init
module.exports.authenticationMiddleware = authenticationMiddleware
