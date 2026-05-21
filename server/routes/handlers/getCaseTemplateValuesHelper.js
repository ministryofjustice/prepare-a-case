const getBaseDateString = require('../../utils/getBaseDateString')
const trackEvent = require('../../utils/analytics')

const getCaseTemplateValuesHelper = caseService => async req => {
  const { params: { defendantId, hearingId }, session, params } = req
  const response = await caseService.getCase(hearingId, defendantId)
  if (response.isError) {
    trackEvent(
      'PiCPrepareACaseErrorTrace',
      {
        operation: 'getCaseTemplateValuesHelper [caseService.getCase]',
        response,
        hearingId,
        defendantId,
        req
      }
    )
    return response
  }
  const caseListDate = session.caseListDate || getBaseDateString()
  return {
    currentCaseListViewLink: session.currentCaseListViewLink,
    backLink: session.backLink,
    caseListDate,
    params: {
      ...params
    },
    data: {
      ...response
    }
  }
}

module.exports = getCaseTemplateValuesHelper
