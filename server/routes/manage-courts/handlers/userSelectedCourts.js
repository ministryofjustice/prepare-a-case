const { settings } = require('../../../config')
const trackEvent = require('../../../utils/analytics')

const get = (getUserSelectedCourts) => async (req, res) => {
  const { session } = req
  const userSelectedCourts = await getUserSelectedCourts(res.locals.user.username)
  if (userSelectedCourts.isError) {
    trackEvent(
      'PiCPrepareACaseErrorTrace',
      {
        operation: 'getUserSelectedCourtsHandler [getUserSelectedCourts]',
        req,
        userSelectedCourts,
        username: res.locals.user.username
      }
    )
    res.render('error', { status: userSelectedCourts.status || 500 })
    return
  }
  session.courts = userSelectedCourts?.items || []
  res.render('view-courts', {
    params: {
      availableCourts: settings.availableCourts,
      chosenCourts: session.courts
    }
  })
}

module.exports = {
  get
}
