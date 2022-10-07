const getAddHearingNoteHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { note, hearingId: targetHearingId } } = req

  if (note) {
    await caseService.addHearingNote(targetHearingId, note, res.locals.user.name)
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`)
}

module.exports = getAddHearingNoteHandler
