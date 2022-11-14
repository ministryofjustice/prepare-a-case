const { settings } = require('../../../config')

const getUserSelectedCourtsHandler = (getUserSelectedCourts) => async (req, res) => {
  const { session } = req
  const userSelectedCourts = await getUserSelectedCourts(res.locals.user.userId)
  if (userSelectedCourts.isError) {
    res.render('error', { status: userSelectedCourts.status || 500 })
    return
  }
  session.courts = userSelectedCourts?.items || []
  if(session.courts?.length) {
    res.render('view-courts', {
      params: {
        availableCourts: settings.availableCourts,
        chosenCourts: session.courts
      }
    })
  } else {
    res.redirect('/my-courts/setup')
  }
}

module.exports = getUserSelectedCourtsHandler
