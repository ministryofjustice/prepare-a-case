const getEditHearingOutcomeHandler = ({ addHearingOutcome }) => {
  return async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, session, body: { hearingOutcomeType, targetHearingId } } = req
    await addHearingOutcome(targetHearingId, hearingOutcomeType)
    session.editHearingOutcomeSuccess = true
    res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
  }
}

module.exports = getEditHearingOutcomeHandler
