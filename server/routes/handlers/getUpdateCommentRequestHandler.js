const trackEvent = require('../../utils/analytics')

const getUpdateCaseCommentHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { caseId, comment, commentId } } = req

  try {
    await caseService.updateCaseComment(caseId, commentId, comment, res.locals.user.name)

    if (!res.locals.user.name) {
      trackEvent('PiCUpdateCaseCommentNoName', res.locals.user)
    }
  } catch (err) {
    trackEvent('PiCUpdateCaseCommentError', err)
  }

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
}

module.exports = getUpdateCaseCommentHandler
