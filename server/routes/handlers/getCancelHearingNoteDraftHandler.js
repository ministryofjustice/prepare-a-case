const getCancelHearingNoteDraftHandler = ({ deleteHearingNoteDraft }) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId, targetHearingId } } = req
  await deleteHearingNoteDraft(targetHearingId)
  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`)
}

module.exports = getCancelHearingNoteDraftHandler
