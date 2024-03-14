const getAddHearingOutcomeHandler = ({ addHearingOutcome }) => {
  return async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session, body: { hearingOutcomeType, targetHearingId, targetdefendantId } } = req
    await addHearingOutcome(targetHearingId, targetdefendantId, hearingOutcomeType)
    session.addHearingOutcomeSuccess = true
    res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
  }
}

module.exports = getAddHearingOutcomeHandler
