const { settings } = require('../../../config')

const getManageCourtByState = (baseRoute, updateSelectedCourts) => async (req, res) => {
  const {
    params: { state },
    query: { error, remove, save },
    session
  } = req
  let formError = error
  let serverError = false
  if (save) {
    if (session.courts && session.courts.length) {
      const updatedCourts = await updateSelectedCourts(
        res.locals.user.username,
        session.courts
      )
      if (updatedCourts.status >= 400) {
        serverError = true
      } else {
        return res.redirect(302, baseRoute)
      }
    } else {
      formError = true
    }
  }
  if (remove && session.courts && session.courts.includes(remove)) {
    session.courts.splice(session.courts.indexOf(remove), 1)
    return res.redirect(req.path)
  }
  const nonce = res.locals.nonce
  res.render('edit-courts', {
    formError,
    serverError,
    state,
    params: {
      availableCourts: settings.availableCourts,
      chosenCourts: session.courts,
      nonce
    }
  })
}

module.exports = getManageCourtByState
