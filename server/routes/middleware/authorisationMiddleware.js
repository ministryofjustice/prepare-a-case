const jwtDecode = require('jwt-decode')
const config = require('../../../config')
const log = require('../../../log')

module.exports = (req, res, next) => {
  // Make sure only users with court admin role can access court app
  if (res.locals && res.locals.user && res.locals.user.token) {
    const roles = jwtDecode(res.locals.user.token).authorities
    if (roles && !roles.includes(config.apis.oauth2.role)) {
      log.warn(`User does not have required role ${config.apis.oauth2.role}`)
      return res.redirect('/autherror')
    }
    return next()
  }
  // No session: get one created
  req.session.returnTo = req.originalUrl
  return res.redirect('/login')
}
