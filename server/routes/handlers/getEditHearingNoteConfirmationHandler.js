const getEditHearingNoteConfirmationHandler = (getCaseAndTemplateValues) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, query: { noteId, targetHearingId } } = req
  const templateValues = await getCaseAndTemplateValues(req)
  const targetHearing = templateValues.data.hearings?.find(hearing => hearing.hearingId === targetHearingId)
  const note = targetHearing?.notes?.find(note => note.noteId === Number(noteId)) || {}
  res.render('confirm-edit-hearing-note', {
    ...templateValues,
    ...note,
    targetHearingId,
    backLink: `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`,
    backText: 'Go back'
  })
}

module.exports = getEditHearingNoteConfirmationHandler