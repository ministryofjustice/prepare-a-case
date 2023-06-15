const log = require('../../../log')
const trackEvent = require('../../utils/analytics')
const { settings } = require('../../../config')
const getCaseSearchHandler = ({ searchCases }, getCaseSearchType) => async (req, res) => {
  const term = req.query.term
  const type = getCaseSearchType(term)
  const { cookies } = req
  const page = req.query.page > 0 ? req.query.page : undefined
  if (term && type) {
    const pageSize = settings.caseSearchResultPageSize
    const data = await searchCases(term, type, page, pageSize)
    trackEvent('PiCCRNSearchPerformed', {
      term,
      type,
      page,
      length: data.data.items.length,
      court: cookies && cookies.currentCourt ? cookies.currentCourt : undefined
    })
    const currentPage = parseInt(req.query.page || 1, 10)
    const templateValues = {
      params: req.params,
      data: {
        ...data.data,
        term
      },
      currentPage,
      pageSize
    }
    res.render('case-search', templateValues)
  } else {
    log.warn('Invalid search term/type: ', term, type)
    res.redirect('/')
  }
}

module.exports = getCaseSearchHandler
