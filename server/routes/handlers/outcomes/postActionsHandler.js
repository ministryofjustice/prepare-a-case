const { getOutcomesList, getCase } = require('../../../services/case-service')
const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList })

module.exports = caseService => async (req, res) => {
  const {
    body: {
      action,
      defendantHearingId
    },
    session
  } = req

  const items = (typeof defendantHearingId === 'string' ? [defendantHearingId] : defendantHearingId)
    .map(defendantHearingId => defendantHearingId.split('_'))

  switch (action) {
    case 'assign':
      await Promise.all(items
        .map(([defendantId, hearingId]) => caseService.assignHearingOutcome(hearingId, defendantId, res.locals.user.name)))

      // load the defender name if there's only the one
      session.outcomeActionAssign = (items.length === 1)
        ? (await getCase(items[0][1], items[0][0])).defendantName
        : items.length

      delete req.body
      return casesToResultHandler(req, res)
  }

  throw new Error('Invalid outcome action')
}
