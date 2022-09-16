const getAddCaseNoteHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session, body: { note, hearingId: targetHearingId } } = req

  if (!note) {
    session.caseNoteBlankError = true
  } else {
    await caseService.addCaseNote(targetHearingId, note, res.locals.user.name)
  }

  res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
}

module.exports = getAddCaseNoteHandler
