const getDeleteHearingNoteHandler =
  ({ deleteHearingNote }) =>
  async (req, res) => {
    const {
      params: { courtCode, hearingId, defendantId },
      body: { targetHearingId, noteId },
      session
    } = req
    await deleteHearingNote(targetHearingId, noteId, defendantId)
    session.deleteHearingNoteSuccess = targetHearingId
    res.redirect(
      302,
      `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`
    )
  }

module.exports = getDeleteHearingNoteHandler
