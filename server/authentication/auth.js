const passport = require('passport')
const { Strategy } = require('passport-oauth2')
const config = require('../../config')
const { generateOauthClientToken } = require('./clientCredentials')

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
  const strategy = new Strategy(
    {
      authorizationURL: `${config.apis.oauth2.url}/oauth/authorize`,
      tokenURL: `${config.apis.oauth2.url}/oauth/token`,
      clientID: config.apis.oauth2.apiClientId,
      clientSecret: config.apis.oauth2.apiClientSecret,
      callbackURL: `${config.domain}/login/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() }
    },
    (accessToken, refreshToken, params, profile, done) => {
      const user = signInService.getUser(accessToken, refreshToken, params.expires_in, params.user_name)
      return done(null, user)
    }
  )

  passport.use(strategy)
}

module.exports.init = init
module.exports.authenticationMiddleware = authenticationMiddleware
