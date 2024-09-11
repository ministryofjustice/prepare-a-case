const { notification } = require('../../../config')

const get = () => async (req, res) => {
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

  const title = 'Set notification'

  res.render('set-notification', { title, currentNotification })
}

const post = () => async (req, res) => {
  const {
    redisClient: { setAsync }
  } = req
  await setAsync(
    'case-list-notification',
    req.body.notification,
    'EX',
    60 * 60 * parseInt(req.body.expires, 10)
  )
  res.redirect(302, '/set-notification')
}

module.exports = { get, post }
