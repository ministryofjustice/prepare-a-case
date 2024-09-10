const setNotificationPreviewHandler = () => async (req, res) => {
  const {
    redisClient: { getAsync }
  } = req
  const currentNotification = await getAsync('case-list-notification')
  res.render('set-notification-preview', { currentNotification })
}

module.exports = setNotificationPreviewHandler