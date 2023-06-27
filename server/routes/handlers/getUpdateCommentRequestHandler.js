const getUpdateCaseCommentHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { caseId, comment, commentId } } = req

  await caseService.updateCaseComment(caseId, commentId, comment, res.locals.user.name)

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
}

module.exports = getUpdateCaseCommentHandler
