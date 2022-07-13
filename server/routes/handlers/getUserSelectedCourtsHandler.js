const { settings } = require('../../../config')

const getUserSelectedCourtsHandler = (getUserSelectedCourts) => async (req, res) => {
  const { session } = req
  const userSelectedCourts = await getUserSelectedCourts(res.locals.user.userId)
  if (userSelectedCourts.isError) {
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

module.exports = getUserSelectedCourtsHandler
