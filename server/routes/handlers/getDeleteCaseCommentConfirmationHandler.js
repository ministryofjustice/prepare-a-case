const getDeleteCaseCommentConfirmationHandler = (getCaseAndTemplateValues) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId, commentId } } = req
  const templateValues = await getCaseAndTemplateValues(req)
  const comment = templateValues.data.caseComments?.find(comment => comment.commentId === Number(commentId))
  res.render('confirm-delete-comment', {
    ...templateValues,
    ...comment,
    backLink: `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#previousComments`,
    backText: 'Go back'
  })
}

module.exports = getDeleteCaseCommentConfirmationHandler
