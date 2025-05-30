const jwtDecode = require('jwt-decode')
const config = require('../../config')
const log = require('../../log')
const axios = require('axios')

const instance = axios.create()

function authorisationMiddleware (req, res, next) {
  instance.interceptors.request.clear()
  // Make sure only users with court admin role can access court app
  if (res.locals?.user?.token) {
    const { authorities: roles, name, user_id: userId, user_uuid: uuid, user_name: username } = jwtDecode(res.locals.user.token)
    Object.assign(res.locals.user, { name, uuid, username, userId })
    if (!roles.includes(config.apis.oauth2.role)) {
      log.warn(`User does not have required role ${config.apis.oauth2.role}`)
      return res.redirect('/autherror')
    }
    instance.interceptors.request.use(config => {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${res.locals.user.token}`
      }
      return config
    })
    return next()
  }
  // No session: get one created
  req.session.returnTo = req.originalUrl
  return res.redirect('/login')
}

module.exports = {
  authorisationMiddleware,
  instance
}
