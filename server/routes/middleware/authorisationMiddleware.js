const jwtDecode = require('jwt-decode')
const logger = require('../../../log.js')
const config = require('../../../config')

module.exports = (req, res, next) => {
  // Make sure only users with court admin role can access court app
  if (res.locals && res.locals.user && res.locals.user.token) {
    const roles = jwtDecode(res.locals.user.token).authorities
    logger.info(roles)
    if (!roles.includes(config.apis.oauth2.role)) {
      return next(unauthorisedError())
    }

    return next()
  }
  // No session: get one created
  req.session.returnTo = req.originalUrl
  return res.redirect('/login')
}

function unauthorisedError () {
  const error = new Error('Unauthorised access: required role not present')
  error.status = 403
  return error
}
