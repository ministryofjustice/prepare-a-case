const jwtDecode = require('jwt-decode')
const config = require('../../config')
const log = require('../../log')

module.exports = (req, res, next) => {
  // Make sure only users with court admin role can access court app
  if (res.locals?.user?.token) {
    const { authorities: roles, name, user_id: userId, user_uuid: uuid, user_name: username } = jwtDecode(res.locals.user.token)
    Object.assign(res.locals.user, { name, uuid, username, userId })
    if (!roles.includes(config.apis.oauth2.role)) {
      log.warn(`User does not have required role ${config.apis.oauth2.role}. Ensure Delius user has role 'CWBT200'.`)
      return res.redirect('/autherror')
    }
    return next()
  }
  // No session: get one created
  req.session.returnTo = req.originalUrl
  return res.redirect('/login')
}
