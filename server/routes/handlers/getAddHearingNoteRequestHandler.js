const trackEvent = require('../../utils/analytics')

const getAddHearingNoteHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { note, hearingId: targetHearingId } } = req

  if (note) {
    try {
      await caseService.addHearingNote(targetHearingId, note, res.locals.user.name)
      if (!res.locals.user.name) {
        trackEvent('PiCAddHearingNoteNoName', res.locals.user)
      }
    } catch (err) {
      trackEvent('PiCAddHearingNoteError', err)
    }
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`)
}

module.exports = getAddHearingNoteHandler
