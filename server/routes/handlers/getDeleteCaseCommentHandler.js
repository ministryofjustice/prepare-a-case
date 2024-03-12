const getDeleteCaseCommentHandler = ({ deleteCaseComment }) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId, commentId }, body: { caseId }, session } = req
  await deleteCaseComment(caseId, defendantId, commentId)
  session.deleteCommentSuccess = caseId
  res.redirect(302, `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
}

module.exports = getDeleteCaseCommentHandler
