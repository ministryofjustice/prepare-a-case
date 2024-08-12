const trackEvent = require('../../utils/analytics')

const getAddHearingOutcomeHandler = ({ addHearingOutcome }) => {
  return async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session, body: { hearingOutcomeType, targetHearingId, targetDefendantId } } = req
    await addHearingOutcome(targetHearingId, targetDefendantId, hearingOutcomeType)
    session.addHearingOutcomeSuccess = true
    trackEvent(
      'PiCPrepareACaseHearingOutcomes',
      {
        operation: 'addHearingOutcome',
        hearingId,
        courtCode,
        defendantId,
        userId: res.locals.user.uuid,
        username: res.locals.user.username
      }
    )
    res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
  }
}

module.exports = getAddHearingOutcomeHandler
