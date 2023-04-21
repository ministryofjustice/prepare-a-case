const getAddHearingOutcomeHandler = ({ addHearingOutcome }) => {
  return async (req, res) => {
    const { params: { courtCode, hearingId, defendantId }, body: { hearingOutcomeType, targetHearingId } } = req
    await addHearingOutcome(targetHearingId, hearingOutcomeType)
    res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`)
  }
}

module.exports = getAddHearingOutcomeHandler
