const logger = require('../../log')
const { settings } = require('../../config')

module.exports = userService => async (req, res, next) => {
  const { redisClient: { getAsync, setAsync } } = req

  if (res.locals.user) {
    const getReply = await getAsync(`${res.locals.user.username}.INFO`)
    if (getReply) {
      if (!settings.reduceStdoutNoise) {
        logger.info('Get user credentials from Redis cache.')
      }
      res.locals.user = { ...JSON.parse(getReply), ...res.locals.user }
      if (!res.locals.user.name || !res.locals.user.userId) {
        logger.warn('Error getting user credentials from Redis cache.', getReply)
      } else {
        return next()
      }
    }
  }
  try {
    const user = res.locals.user && (await userService.getUser(res.locals.user))
    if (user) {
      res.locals.user = { ...user, ...res.locals.user }
      await setAsync(`${res.locals.user.username}.INFO`, JSON.stringify(res.locals.user), 'EX', 60 * 60 * 24)
    }
  } catch (error) {
    logger.error(error, `Failed to retrieve user for: ${res.locals.user}`)
    throw error
  }
  next()
}
