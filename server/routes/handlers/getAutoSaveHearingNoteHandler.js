const logger = require('../../../log')

const getAutoSaveHearingNoteHandler = ({ saveDraftHearingNote }) => async (req, res) => {
  const { body: { note, hearingId: targetHearingId } } = req

  const response = await saveDraftHearingNote(targetHearingId, note, res.locals.user.name)
  if (response.status < 200 || response.status > 399) {
    logger.warn('Error while saving draft note', { status: response.status, response: response.data, targetHearingId })
  }
  res.send(response.data, response.status)
}

module.exports = getAutoSaveHearingNoteHandler
