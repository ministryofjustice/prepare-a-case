const express = require('express')

const { getOutcomesList, assignHearingOutcome, updateHearingOutcomeToResulted, getCase } = require('../../../services/case-service')
const { getFilters, setFilters } = require('../../../services/user-preference-service')
const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList }, { getFilters, setFilters })
const casesInProgressHandler = require('./getCasesInProgressHandler')({ getOutcomesList }, { getFilters, setFilters })
const getResultedCasesHandler = require('./getResultedCasesHandler')({ getOutcomesList }, { getFilters, setFilters })
const assignHearingOutcomeRouteHandler = require('./getAssignUserToOutcomeRequestHandler')({ assignHearingOutcome })
const getMoveToResultedHandler = require('./getMoveToResultedHandler')({ updateHearingOutcomeToResulted, getCase })
const postActionsHandler = require('./postActionsHandler')({ assignHearingOutcome })

const { defaults } = require('../../middleware/defaults')
const catchErrors = require('../catchAsyncErrors')
const outcomesMiddleware = require('../../middleware/outcomesMiddleware')

const outcomesRouter = express.Router({ mergeParams: true })

outcomesRouter.get('/', defaults, outcomesMiddleware('NEW'), catchErrors(casesToResultHandler))
outcomesRouter.post('/', defaults, outcomesMiddleware('NEW'), catchErrors(postActionsHandler))
outcomesRouter.get('/in-progress', defaults, outcomesMiddleware('IN_PROGRESS'), catchErrors(casesInProgressHandler))
outcomesRouter.get('/resulted-cases', defaults, outcomesMiddleware('RESULTED'), catchErrors(getResultedCasesHandler))
outcomesRouter.get('/hearing/:hearingId/defendant/:defendantId/move-to-resulted', defaults, catchErrors(getMoveToResultedHandler))
outcomesRouter.post('/hearing/:hearingId/assign', defaults, catchErrors(assignHearingOutcomeRouteHandler))

module.exports = outcomesRouter
