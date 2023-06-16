const log = require('../../../log')
const trackEvent = require('../../utils/analytics')
const { settings } = require('../../../config')
const getCaseSearchHandler = ({ searchCases }, getCaseSearchType) => async (req, res) => {
  const term = req.query.term
  const { searchType: type, error } = getCaseSearchType(term)
  const { cookies } = req
  const page = req.query.page > 0 ? req.query.page : undefined

  const trackingEvent = {
    term,
    type,
    page,
    court: cookies && cookies.currentCourt ? cookies.currentCourt : undefined,
    userError: error
  }

  if (error) {
    res.render('case-search', { searchError: error, term })
    return
  }

  if (term && type) {
    const pageSize = settings.caseSearchResultPageSize
    const data = await searchCases(term, type, page, pageSize)

    trackingEvent.length = data?.data?.items?.length

    const currentPage = parseInt(req.query.page || 1, 10)
    const templateValues = {
      params: req.params,
      data: {
        ...data.data
      },
      currentPage,
      pageSize,
      term
    }
    res.render('case-search', templateValues)
  } else {
    log.warn('Invalid search term/type: ', term, type)
    res.redirect('/')
  }

  trackEvent('PiCCaseSearchPerformed', trackingEvent)
}

module.exports = getCaseSearchHandler
