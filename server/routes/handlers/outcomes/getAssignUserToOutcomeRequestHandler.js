const trackEvent = require('../../../utils/analytics')

const getAssignUserToOutcomeRequestHandler = caseService => async (req, res) => {
  const { params: { hearingId }, session, body: { targetDefendantId: defendantId, targetCourtCode: courtCode } } = req

  try {
    await caseService.assignHearingOutcome(hearingId, res.locals.user.name)

    session.assignHearingOutcomeSuccess = true

    if (!res.locals.user.name) {
      trackEvent('PiCAssignUserToOutcomeNoName', res.locals.user)
    }
  } catch (err) {
    trackEvent('PiCAssignUserToOutcomeError', err)
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
}

module.exports = getAssignUserToOutcomeRequestHandler
