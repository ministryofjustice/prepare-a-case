const logger = require('../../log')
const trackEvent = require('../../utils/analytics')

const getAutoSaveHearingNoteEditsHandler = ({ updateHearingNote }) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { note, hearingId: targetHearingId, noteId } } = req

  const response = await updateHearingNote(targetHearingId, note, noteId, res.locals.user.name)

  if (!res.locals.user.name) {
    trackEvent('PiCAutoSaveHearingNoteEdittNoName', res.locals.user)
  }

  if (response.status < 200 || response.status > 399) {
    logger.warn('Error while saving edits to note', { status: response.status, response: response.data, targetHearingId, noteId })
    trackEvent('PiCEditNoteFail', {
      court: courtCode,
      status: response.status,
      response: response.data,
      targetHearingId,
      noteId
    })
  } else {
    trackEvent('PiCEditNoteSuccess', {
      court: courtCode,
      targetHearingId,
      noteId
    })
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`)
}

module.exports = getAutoSaveHearingNoteEditsHandler
