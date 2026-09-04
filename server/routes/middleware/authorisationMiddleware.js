const jwtDecode = require('jwt-decode')
const config = require('../../config')
const log = require('../../log')
const axios = require('axios')
const { AsyncLocalStorage } = require('async_hooks')

const instance = axios.create()

// Each request's bearer token is kept in its own async context so concurrent
// requests from different users can never leak each other's tokens.
const requestContext = new AsyncLocalStorage()
let authInterceptorRegistered = false

function authorisationMiddleware (req, res, next) {
  // Make sure only users with court admin role can access court app
  if (res.locals?.user?.token) {
    const { authorities: roles, name, user_id: userId, user_uuid: uuid, user_name: username } = jwtDecode(res.locals.user.token)
    Object.assign(res.locals.user, { name, uuid, username, userId })
    if (!roles.includes(config.apis.oauth2.role)) {
      log.warn(`User does not have required role ${config.apis.oauth2.role}`)
      return res.redirect('/autherror')
    }

    if (!authInterceptorRegistered) {
      authInterceptorRegistered = true
      instance.interceptors.request.use(requestConfig => {
        const token = requestContext.getStore()?.token
        requestConfig.headers = {
          ...requestConfig.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
        return requestConfig
      })
    }

    return requestContext.run({ token: res.locals.user.token }, next)
  }
  // No session: get one created
  req.session.returnTo = req.originalUrl
  return res.redirect('/login')
}

module.exports = {
  authorisationMiddleware,
  instance
}
