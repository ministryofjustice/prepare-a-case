const logger = require('../../../log.js')

module.exports = userService => async (req, res, next) => {
  const { redisClient: { getAsync, setAsync } } = req

  if (res.locals.user) {
    const getReply = await getAsync(`${res.locals.user.username}.INFO`)
    if (getReply) {
      logger.info('Get user credentials from Redis cache.')
      res.locals.user = { ...JSON.parse(getReply), ...res.locals.user }
      return next()
    }
  }
  try {
    const user = res.locals.user && (await userService.getUser(res.locals.user))
    if (user) {
      res.locals.user = { ...user, ...res.locals.user }
      await setAsync(`${res.locals.user.username}.INFO`, JSON.stringify(res.locals.user), 'EX', 60 * 60 * 24)
    } else {
      logger.info('No user available')
    }
  } catch (error) {
    logger.error(error, `Failed to retrieve user for: ${res.locals.user}`)
  }
  next()
}
