const { settings } = require('../../config')
const { getPaginationObject } = require('../helpers')
const getMatchingRecordRouteHandler = (getMatchDetails, getCaseAndTemplateValues) => async (req, res) => {
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

  // Check if offenderMatchDetails is an array
  const { offenderMatchDetails } = response
  if (!Array.isArray(offenderMatchDetails)) {
    return res.render('error', {
      ...templateValues,
      message: 'Unexpected data format received from the server.'
    })
  }

  const matchingRecordsCount = offenderMatchDetails.length
  if (matchingRecordsCount === 0) {
    return res.render('no-match', {
      ...templateValues,
      message: 'No match details found for the defendant.'
    })
  }

  // Parse page number and ensure it's a positive integer
  let currentPage = parseInt(queryParams.page, 10)
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1
  }

  const recordsPerPage = settings.matchingRecordsToBeShownPerPage

  // Calculate start and end index for slicing data
  const start = (currentPage - 1) * recordsPerPage
  const end = Math.min(start + recordsPerPage, matchingRecordsCount)

  // Slice the data for the current page
  const paginatedMatchData = response.offenderMatchDetails.slice(start, end)

  const pageParams = {
    matchingRecordsCount,
    page: currentPage,
    recordsPerPage,
    courtCode,
    caseId,
    hearingId,
    defendantId
  }

  templateValues.session = {
    ...session
  }
  templateValues.data = {
    ...templateValues.data,
    matchData: paginatedMatchData,
    pagination: getPaginationObject(pageParams)
  }
  session.confirmedMatch = undefined
  session.matchName = defendantName
  session.formError = false
  session.serverError = false
  session.backLink = path
  res.render('match-defendant', templateValues)
}

module.exports = getMatchingRecordRouteHandler
