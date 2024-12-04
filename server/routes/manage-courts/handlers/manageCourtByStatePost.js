const manageCourtByStatePost = (baseRoute) => async (req, res) => {
  const {
    params: { state },
    session,
    body: { court }
  } = req
  if (!court) {
    return res.redirect(302, `${baseRoute}/${state}?error=true`)
  }
  session.courts = session.courts || []
  if (court && !session.courts.includes(court)) {
    session.courts.push(court)
  }
  res.redirect(req.path)
}

module.exports = manageCourtByStatePost
