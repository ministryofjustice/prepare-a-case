const { getOutcomesList } = require('../../../services/case-service')
const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList })

module.exports = caseService => async (req, res) => {
  const {
    body: {
      action,
      hearingId
    },
    session
  } = req

  let items

  switch (action) {
    case 'assign':
      items = typeof hearingId === 'string' ? [hearingId] : hearingId
      await Promise.all(items
        .map(hearingId => caseService.assignHearingOutcome(hearingId, res.locals.user.name)))
      session.outcomeActionAssign = items.length
      delete req.body
      return casesToResultHandler(req, res)
  }

  throw new Error('Invalid outcome action')
}
