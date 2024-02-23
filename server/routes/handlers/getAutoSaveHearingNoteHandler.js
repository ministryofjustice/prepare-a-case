const logger = require('../../log')
const trackEvent = require('../../utils/analytics')

const getAutoSaveHearingNoteHandler =
  ({ saveDraftHearingNote }) =>
    async (req, res) => {
      const {
        body: { note, hearingId: targetHearingId },
        params: { defendantId }
      } = req

      const response = await saveDraftHearingNote(
        targetHearingId,
        note,
        res.locals.user.name,
        defendantId
      )

      if (!res.locals.user.name) {
        trackEvent('PiCAutoSaveHearingNoteNoName', res.locals.user)
      }

      if (response.status < 200 || response.status > 399) {
        logger.warn('Error while saving draft note', {
          status: response.status,
          response: response.data,
          targetHearingId
        })
      }
      res.send(response.data, response.status)
    }

module.exports = getAutoSaveHearingNoteHandler
