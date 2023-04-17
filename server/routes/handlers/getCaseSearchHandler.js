const log = require('../../../log')
const getCaseSearchHandler = ({ searchCases }, getCaseSearchType) => async (req, res) => {
  const term = req.query.term
  const type = getCaseSearchType(term)
  if (term && type) {
    const data = await searchCases(term, type)
    const templateValues = {
      params: req.params,
      data: {
        ...data.data,
        term
      }
    }
    res.render('case-search', templateValues)
  } else {
    log.warn('Invalid search term/type: ', term, type)
    res.redirect('/')
  }
}

module.exports = getCaseSearchHandler
