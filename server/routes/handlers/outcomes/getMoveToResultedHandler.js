const trackEvent = require('../../../utils/analytics')
const { v4: uuidv4 } = require('uuid')
const getMoveToResultedHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session } = req
  const correlationId = uuidv4()

  await caseService.updateHearingOutcomeToResulted(hearingId, defendantId, correlationId)

  trackEvent(
    'PiCPrepareACaseHearingOutcomes',
    {
      operation: 'updateHearingOutcomeToResulted',
      hearingId,
      courtCode,
      defendantId,
      correlationId,
      userId: res.locals.user.uuid,
      user: res.locals.user
    }
  )

  session.moveToResultedSuccess = req.query.defendantName

  res.redirect(`/${courtCode}/outcomes/in-progress`)
}

module.exports = getMoveToResultedHandler
