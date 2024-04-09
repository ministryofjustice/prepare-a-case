const jwtDecode = require('jwt-decode')
const passport = require('passport')
const { Strategy } = require('passport-oauth2')
const roles = require('../../config/roles.json')

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
passport.use(new Strategy(
  {
    authorizationURL: `${config.apis.oauth2.redirect}/oauth/authorize`,
    tokenURL: `${config.apis.oauth2.url}/oauth/token`,
    clientID: config.apis.oauth2.apiClientId,
    clientSecret: config.apis.oauth2.apiClientSecret,
    callbackURL: `${config.domain}/login/callback`,
    state: env.NOMIS_DISABLE_OAUTH_STATE !== 'true',
    customHeaders: { 
      Authorization: `Basic ${Buffer.from(`${config.apis.oauth2.apiClientId}:${config.apis.oauth2.apiClientSecret}`).toString('base64')}` 
    }
  },
  (accessToken, refreshToken, profile, cb) => cb(null, { accessToken })
))

module.exports = async app => {
  
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      const { authorities, name, user_id: id, user_uuid: uuid, user_name: username } = jwtDecode(req.user.accessToken)
      const myRoles = authorities
        .map(role => role.slice(5)) // remove ROLE_
      res.locals.user = { roles: myRoles, name, uuid, username, id }
      // check has all required roles
      const missing = Object.entries(myRoles)
        .filter(([id, entry]) => entry.required && !roles
          .includes(id))
      if (missing.length) {
        process.emitWarning(`User ${username} lacks mandatory role(s) [${missing}]`, 'Auth', 'RoleConfig')
        return res.redirect('/autherror', { missing })
      }
      return next()
    }

    req.session.returnTo = req.originalUrl
    res.redirect('/login')
  })

}