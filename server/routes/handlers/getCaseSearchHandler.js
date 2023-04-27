const log = require('../../../log')
const trackEvent = require('../../utils/analytics')
const getCaseSearchHandler = ({ searchCases }, getCaseSearchType) => async (req, res) => {
  const term = req.query.term
  const type = getCaseSearchType(term)
  const { cookies } = req
  if (term && type) {
    const data = await searchCases(term, type)
    trackEvent('CRN Search Performed', {
      term,
      type,
      length: data.data.items.length,
      court: cookies && cookies.currentCourt ? cookies.currentCourt : undefined
    })
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
