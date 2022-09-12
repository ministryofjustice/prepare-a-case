const getAddCaseNoteHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session, body: { caseId, note } } = req

  if (!note) {
    session.caseNoteBlankError = true
  } else {
    await caseService.addCaseNote(caseId, note, res.locals.user.name)
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseNotes`)
}

module.exports = getAddCaseNoteHandler
