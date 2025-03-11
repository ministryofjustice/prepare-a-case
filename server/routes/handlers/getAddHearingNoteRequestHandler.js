const trackEvent = require('../../utils/analytics')

const getAddHearingNoteHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, hearingId, defendantId },
    body: { note, hearingId: targetHearingId },
    session
  } = req

  if (note) {
    await caseService.addHearingNote(
      targetHearingId,
      note,
      res.locals.user.name,
      defendantId
    )
    session.addHearingNoteSuccess = targetHearingId
    if (!res.locals.user.name) {
      trackEvent('PiCAddHearingNoteNoName', res.locals.user)
    }
  }
  
  res.redirect(
    `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`
  )
}

module.exports = getAddHearingNoteHandler
