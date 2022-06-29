const getBaseDateString = require('../../utils/getBaseDateString')

const getCaseTemplateValuesHelper = caseService => async req => {
  const { params: { defendantId, hearingId }, session, params } = req
  const response = await caseService.getCase(hearingId, defendantId)
  if (response.isError) {
    return response
  }
  const caseListDate = session.caseListDate || getBaseDateString()
  return {
    currentCaseListViewLink: session.currentCaseListViewLink,
    backLink: session.backLink,
    caseListDate: caseListDate,
    params: {
      ...params
    },
    data: {
      ...response
    }
  }
}

module.exports = getCaseTemplateValuesHelper
