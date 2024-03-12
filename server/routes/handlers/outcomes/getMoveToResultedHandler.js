const trackEvent = require('../../../utils/analytics')
const getMoveToResultedHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session } = req

  await caseService.updateHearingOutcomeToResulted(hearingId, defendantId)

  trackEvent(
    'PiCPrepareACaseHearingOutcomes',
    {
      operation: 'updateHearingOutcomeToResulted',
      hearingId,
      courtCode,
      userId: res.locals.user.userId
    }
  )

  session.moveToResultedSuccess = req.query.defendantName

  res.redirect(`/${courtCode}/outcomes/in-progress`)
}

module.exports = getMoveToResultedHandler
