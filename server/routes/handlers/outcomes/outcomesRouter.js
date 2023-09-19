const express = require('express')

const { getOutcomesList, assignHearingOutcome } = require('../../../services/case-service')
const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList })
const casesInProgressHandler = require('./getCasesInProgressHandler')({ getOutcomesList })
const getResultedCasesHandler = require('./getResultedCasesHandler')({ getOutcomesList })
const assignHearingOutcomeRouteHandler = require('./getAssignUserToOutcomeRequestHandler')({ assignHearingOutcome })

const { defaults } = require('../../middleware/defaults')
const catchErrors = require('../catchAsyncErrors')
const outcomesMiddleware = require('../../middleware/outcomesMiddleware')

const outcomesRouter = express.Router({ mergeParams: true })

outcomesRouter.get('/', defaults, outcomesMiddleware('NEW'), catchErrors(casesToResultHandler))
outcomesRouter.get('/in-progress', defaults, outcomesMiddleware('IN_PROGRESS'), catchErrors(casesInProgressHandler))
outcomesRouter.get('/resulted-cases', defaults, outcomesMiddleware('RESULTED'), catchErrors(getResultedCasesHandler))
outcomesRouter.post('/hearing/:hearingId/assign', defaults, catchErrors(assignHearingOutcomeRouteHandler))

module.exports = outcomesRouter
