const { notification } = require('../../../config')

const setNotificationHandler = () => async (req, res) => {
  const {
    redisClient: { getAsync }
  } = req
  const currentNotification = await getAsync('case-list-notification')
  const reject = () => {
    res.setHeader('www-authenticate', 'Basic')
    res.sendStatus(401)
  }

  const authorization = req.headers.authorization
  if (!authorization) {
    return reject()
  }

  const [username, password] = Buffer.from(
    authorization.replace('Basic ', ''),
    'base64'
  )
    .toString()
    .split(':')
  if (
    username !== notification.username ||
    password !== notification.password
  ) {
    return reject()
  }
  res.render('set-notification', { currentNotification })
}

module.exports = setNotificationHandler
