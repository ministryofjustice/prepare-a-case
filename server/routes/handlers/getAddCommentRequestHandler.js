const trackEvent = require('../../utils/analytics')

const getAddCaseCommentHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session, body: { caseId, comment } } = req

  if (!comment) {
    session.caseCommentBlankError = true
  } else {
    await caseService.addCaseComment(caseId, defendantId, comment, res.locals.user.name)
    session.addCommentSuccess = caseId

    if (!res.locals.user.name) {
      trackEvent('PiCAddCaseCommentNoName', res.locals.user)
    }

    trackEvent('PiCCaseCommentSuccess', {
      court: courtCode,
      caseId
    })
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
}

module.exports = getAddCaseCommentHandler
