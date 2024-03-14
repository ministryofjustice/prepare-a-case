const getEditHearingOutcomeHandler = ({ addHearingOutcome }) => {
  return async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session, body: { hearingOutcomeType, targetHearingId, targetDefendantId } } = req
    await addHearingOutcome(targetHearingId, targetDefendantId, hearingOutcomeType)
    session.editHearingOutcomeSuccess = true
    res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
  }
}

module.exports = getEditHearingOutcomeHandler
