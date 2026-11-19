const { AsyncLocalStorage } = require('async_hooks')

const userContext = new AsyncLocalStorage()

function middleware (req, res, next) {
  userContext.run({ userUuid: res.locals.user?.uuid }, next)
}

function getUserUuid () {
  return userContext.getStore()?.userUuid
}

module.exports = { middleware, getUserUuid }
