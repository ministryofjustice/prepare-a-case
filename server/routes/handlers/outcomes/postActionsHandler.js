const { getOutcomesList } = require('../../../services/case-service')
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
        // WARN: the defendantID should be consumed by this function - backend bug!
        .map(([defendantId, hearingId]) => caseService.assignHearingOutcome(hearingId, res.locals.user.name)))
      session.outcomeActionAssign = items.length
      delete req.body
      return casesToResultHandler(req, res)
  }

  throw new Error('Invalid outcome action')
}
