const getAssignUserToOutcomeRequestHandler = caseService => async (req, res) => {
  const { params: { hearingId }, session, body: { targetDefendantId: defendantId, targetCourtCode: courtCode } } = req

  await caseService.assignHearingOutcome(hearingId, res.locals.user.name)
  session.assignHearingOutcomeSuccess = true
  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
}

module.exports = getAssignUserToOutcomeRequestHandler
