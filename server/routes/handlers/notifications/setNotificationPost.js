//setNotificationPostHandler
const setNotificationPreviewHandler = () => async (req, res) => {
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

module.exports = setNotificationPreviewHandler