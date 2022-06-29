const { getPsrRequestedConvictions } = require("../helpers");

const getProbationRecordRouteHandler = (communityService, getCaseAndTemplateValues) => async (req, res) => {
  const { session } = req
  const templateValues = await getCaseAndTemplateValues(req)
  if (templateValues.isError) {
    res.render('error', { status: templateValues.status })
    return
  }
  templateValues.title = 'Probation record'

  const crn = templateValues.data.crn
  const communityResponse = await communityService.getProbationRecord(crn, true)
  templateValues.params.showAllPreviousOrders = session.showAllPreviousOrders
  templateValues.data.communityData = {
    ...communityResponse
  }
  templateValues.data.psrRequestedConvictions = getPsrRequestedConvictions(communityResponse)

  res.render('case-summary-record', templateValues)
}

module.exports = getProbationRecordRouteHandler;