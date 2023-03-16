const logger = require('../../../log')

const getAutoSaveHearingNoteEditsHandler = ({ updateHearingNote }) => async (req, res) => {
  const { body: { note, hearingId: targetHearingId, noteId } } = req

  const response = await updateHearingNote(targetHearingId, note, noteId, res.locals.user.name)
  if (response.status < 200 || response.status > 399) {
    logger.warn('Error while saving edits to note', { status: response.status, response: response.data, targetHearingId, noteId })
  }
  res.send(response.data, response.status)
}

module.exports = getAutoSaveHearingNoteEditsHandler
