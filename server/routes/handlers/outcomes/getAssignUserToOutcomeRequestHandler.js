const trackEvent = require('../../../utils/analytics')

const getAssignUserToOutcomeRequestHandler = caseService => async (req, res) => {
  const { params: { hearingId, defendantId }, session, body: { targetDefendantId, targetCourtCode: courtCode } } = req

  await caseService.assignHearingOutcome(hearingId, defendantId, res.locals.user.name)

  session.assignHearingOutcomeSuccess = true

  if (!res.locals.user.name) {
    trackEvent('PiCAssignUserToOutcomeNoName', res.locals.user)
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${targetDefendantId}/summary`)
}

module.exports = getAssignUserToOutcomeRequestHandler
