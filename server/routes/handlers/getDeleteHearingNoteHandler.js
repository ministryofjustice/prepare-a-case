const getDeleteHearingNoteHandler = ({ deleteHearingNote }) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { targetHearingId, noteId }, session } = req
  await deleteHearingNote(targetHearingId, noteId)
  session.deleteHearingNoteSuccess = targetHearingId
  res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseProgressComponent`)
}

module.exports = getDeleteHearingNoteHandler
