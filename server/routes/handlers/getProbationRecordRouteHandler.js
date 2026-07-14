const { getPsrRequestedConvictions, getLastSentencedConvictionPSR } = require('../helpers')
const trackEvent = require('../../utils/analytics')
const { properCase, removeTitle, apostropheInName } = require('../../utils/nunjucksFilters')

const getProbationRecordRouteHandler = (communityService, getCaseAndTemplateValues) => async (req, res) => {
  const { session } = req
  const templateValues = await getCaseAndTemplateValues(req)
  if (templateValues.isError) {
    res.render('error', { status: templateValues.status })
    trackEvent(
      'PiCPrepareACaseErrorTrace',
      {
        operation: 'getProbationRecordRouteHandler [templateValues]',
        req,
        templateValues
      }
    )
    return
  }

  const formattedName = removeTitle(properCase(apostropheInName(templateValues.data.defendantName)))
  templateValues.title = formattedName + ' - ' + 'Probation record'

  const crn = templateValues.data.crn
  const communityResponse = await communityService.getProbationRecord(crn, true)
  templateValues.params.showAllPreviousOrders = session.showAllPreviousOrders
  templateValues.data.communityData = {
    ...communityResponse
  }
  templateValues.data.psrRequestedConvictions = getPsrRequestedConvictions(communityResponse)
  templateValues.data.lastPsrWithSentence = getLastSentencedConvictionPSR(communityResponse)

  res.render('case-summary/case-summary-record', templateValues)
}

module.exports = getProbationRecordRouteHandler
