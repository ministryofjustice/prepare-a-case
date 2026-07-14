const { settings } = require('../../../config')
const { getBackUrl } = require('../../helpers')
const trackEvent = require('../../../utils/analytics')
const { getPagination } = require('../../../utils/pagination')
const { formatName } = require('../../../utils/nunjucksFilters')

const matchingRecordRouteHandler = (getMatchDetails, getCaseAndTemplateValues) => async (req, res) => {
  const {
    params: { courtCode, caseId, hearingId, defendantId },
    session,
    path,
    query: queryParams
  } = req

  const templateValues = await getCaseAndTemplateValues(req)

  const { data: { name, defendantName } } = templateValues

  const defendantFullName = name
    ? name.forename1 +
      (name.forename2 ? ' ' + name.forename2 : '') +
      (name.forename3 ? ' ' + name.forename3 : '') +
      ' ' + name.surname
    : defendantName
  const formattedName = formatName(defendantFullName)
  templateValues.heading = formattedName
  const subheading = 'Review possible NDelius records'
  templateValues.subheading = subheading
  templateValues.title = formattedName + ' - ' + subheading

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

  if (settings.enableMatcherLogging) {
    trackEvent('PiCMatcherLogging', response)
    trackEvent('PiCMatcherRecordsCount', offenderMatchDetails.length)

    if (currentPage > 1) {
      trackEvent('PiCMatcherLaterPagesClicked')
    }
  }

  const baseUrl = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}?`
  const matchingRecordsCount = offenderMatchDetails.length
  const totalPages = Math.round(Math.ceil((matchingRecordsCount / recordsPerPage)))

  templateValues.session = {
    ...session
  }
  templateValues.data = {
    ...templateValues.data,
    matchData: paginatedMatchData,
    pagination: {
      ...getPagination(currentPage, matchingRecordsCount, recordsPerPage, baseUrl),
      totalPages,
      matchingRecordsCount,
      from: start,
      to: end
    },
    backUrl: getBackUrl(session, hearingId, defendantId),
    defendantFullName
  }
  session.confirmedMatch = undefined
  session.matchName = defendantName
  session.formError = false
  session.serverError = false
  session.backLink = path
  session.defendantId = defendantId
  session.hearingId = hearingId
  res.render('match-defendant', templateValues)
}

module.exports = matchingRecordRouteHandler
