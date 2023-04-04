const getCaseSearchHandler = ({ searchCases }) => async (req, res) => {
  const term = req.query.term
  if (term) {
    const data = await searchCases(term)

    const templateValues = {
      params: req.params,
      data: {
        ...data.data,
        term
      }
    }
    res.render('case-search', templateValues)
  } else {
    res.redirect('/')
  }
}

module.exports = getCaseSearchHandler
