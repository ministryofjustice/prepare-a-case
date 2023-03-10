const logger = require('../../../log')

const getAutoSaveHearingNoteHandler = (caseService) => async (req, res) => {
  const { body: { note, hearingId: targetHearingId } } = req

  const response = await caseService.saveDraftHearingNote(targetHearingId, note, res.locals.user.name)
  if (response.status < 200 || response.status > 399) {
    logger.warn({ status: response.status, response: response.data })
  }
  res.body(response.body)
  res.sendStatus(response.status)
}

module.exports = getAutoSaveHearingNoteHandler
