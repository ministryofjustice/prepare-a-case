const getSearchByDefendant = ({ searchByCrn }) => async (req, res) => {
  const crn = req.query.crn
  if (crn) {
    const data = await searchByCrn(crn)

    const templateValues = {
      params: req.params,
      data: {
        ...data.data,
        crn
      }
    }
    res.render('case-search', templateValues)
  } else {
    res.redirect('/')
  }
}

module.exports = getSearchByDefendant
