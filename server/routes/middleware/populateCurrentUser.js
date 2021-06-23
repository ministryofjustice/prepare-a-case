const { promisify } = require('util')
const redis = require('redis')
const logger = require('../../../log.js')
const config = require('../../../config')

const client = redis.createClient({
  port: config.redis.port,
  password: config.redis.password,
  host: config.redis.host,
  tls: config.redis.tls_enabled === 'true' ? {} : false
})
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

module.exports = userService => async (req, res, next) => {
  if (res.locals.user) {
    const getReply = await getAsync(`${res.locals.user.username}.INFO`)
    if (getReply) {
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
