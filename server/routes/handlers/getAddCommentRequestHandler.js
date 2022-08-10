const getAddCaseCommentHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, body: { caseId, comment } } = req
  await caseService.addCaseComment(caseId, comment, res.locals.name)

  res.redirect(`/${courtCode} + '/hearing/${hearingId}/defendant/${defendantId}/summary`)
}

module.exports = getAddCaseCommentHandler
