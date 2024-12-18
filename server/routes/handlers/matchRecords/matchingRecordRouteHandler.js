const { settings } = require('../../../config')
const { getPaginationObject, getBackUrl } = require('../../helpers')
const trackEvent = require('../../../utils/analytics')

const matchingRecordRouteHandler = (getMatchDetails, getCaseAndTemplateValues) => async (req, res) => {
  const {
    params: { courtCode, caseId, hearingId, defendantId },
    session,
    path,
    query: queryParams
  } = req

  const templateValues = await getCaseAndTemplateValues(req)
  templateValues.title = 'Review possible NDelius records'

  const { data: { defendantName } } = templateValues

  const response = await getMatchDetails(defendantId)

  const { offenderMatchDetails } = response

  if (!Array.isArray(offenderMatchDetails) || offenderMatchDetails.length === 0) {
    return res.render('error', {
      status: response.status || 500
    })
  }

  let currentPage = parseInt(queryParams.page, 10)
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1
  }

  const recordsPerPage = settings.matchingRecordsToBeShownPerPage

  const start = (currentPage - 1) * recordsPerPage
  const end = Math.min(start + recordsPerPage, offenderMatchDetails.length)

  const paginatedMatchData = response.offenderMatchDetails.slice(start, end)

  const pageParams = {
    matchingRecordsCount: offenderMatchDetails.length,
    page: currentPage,
    recordsPerPage,
    courtCode,
    caseId,
    hearingId,
    defendantId
  }

  if (settings.enableMatcherLogging) {
    trackEvent('PiCMatcherLogging', response)
    trackEvent('PiCMatcherRecordsCount', offenderMatchDetails.length)

    if (currentPage > 1) {
      trackEvent('PiCMatcherLaterPagesClicked')
    }
  }

  templateValues.session = {
    ...session
  }
  templateValues.data = {
    ...templateValues.data,
    matchData: paginatedMatchData,
    pagination: getPaginationObject(pageParams),
    backUrl: getBackUrl(session, hearingId, defendantId)
  }
  session.confirmedMatch = undefined
  session.matchName = defendantName
  session.formError = false
  session.serverError = false
  session.backLink = path
  res.render('match-defendant', templateValues)
}

module.exports = matchingRecordRouteHandler
