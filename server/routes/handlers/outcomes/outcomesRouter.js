const express = require('express')

const { getOutcomesList, assignHearingOutcome, updateHearingOutcomeToResulted } = require('../../../services/case-service')
const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList })
const casesInProgressHandler = require('./getCasesInProgressHandler')({ getOutcomesList })
const getResultedCasesHandler = require('./getResultedCasesHandler')({ getOutcomesList })
const getOnHoldCasesHandler = require('./getOnHoldCasesHandler')({ getOutcomesList })
const assignHearingOutcomeRouteHandler = require('./getAssignUserToOutcomeRequestHandler')({ assignHearingOutcome })
const getMoveToResultedHandler = require('./getMoveToResultedHandler')({ updateHearingOutcomeToResulted })
const postActionsHandler = require('./postActionsHandler')({ assignHearingOutcome })

const { defaults } = require('../../middleware/defaults')
const catchErrors = require('../catchAsyncErrors')
const outcomesMiddleware = require('../../middleware/outcomesMiddleware')

const outcomesRouter = express.Router({ mergeParams: true })

outcomesRouter.get('/', defaults, outcomesMiddleware('NEW'), catchErrors(casesToResultHandler))
outcomesRouter.post('/', defaults, outcomesMiddleware('NEW'), catchErrors(postActionsHandler))
outcomesRouter.get('/in-progress', defaults, outcomesMiddleware('IN_PROGRESS'), catchErrors(casesInProgressHandler))
outcomesRouter.get('/on-hold', defaults, outcomesMiddleware('ON_HOLD'), catchErrors(getOnHoldCasesHandler))
outcomesRouter.get('/resulted-cases', defaults, outcomesMiddleware('RESULTED'), catchErrors(getResultedCasesHandler))
outcomesRouter.get('/hearing/:hearingId/defendant/:defendantId/move-to-resulted', defaults, catchErrors(getMoveToResultedHandler))
outcomesRouter.post('/hearing/:hearingId/assign', defaults, catchErrors(assignHearingOutcomeRouteHandler))

module.exports = outcomesRouter
