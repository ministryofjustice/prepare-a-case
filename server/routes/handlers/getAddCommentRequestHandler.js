const trackEvent = require('../../utils/analytics')

const getAddCaseCommentHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session, body: { caseId, comment } } = req

  if (!comment) {
    session.caseCommentBlankError = true
  } else {
    await caseService.addCaseComment(caseId, comment, res.locals.user.name)

    trackEvent('PiCCaseCommentSuccess', {
      court: courtCode,
      caseId
    })
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
}

module.exports = getAddCaseCommentHandler
