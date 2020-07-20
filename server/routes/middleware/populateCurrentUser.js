const logger = require('../../../log.js')

module.exports = userService => async (req, res, next) => {
  try {
    const user = res.locals.user && (await userService.getUser(res.locals.user))

    if (user) {
      res.locals.user = { ...user, ...res.locals.user }
    } else {
      logger.info('No user available')
    }
  } catch (error) {
    logger.error(error, `Failed to retrieve user for: ${res.locals.user}`)
  }
  next()
}
