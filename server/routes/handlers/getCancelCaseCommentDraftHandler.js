const getCancelCaseCommentDraftHandler = ({ deleteCaseCommentDraft }) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId, caseId } } = req
  await deleteCaseCommentDraft(caseId, defendantId)

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#caseComments`)
}

module.exports = getCancelCaseCommentDraftHandler
