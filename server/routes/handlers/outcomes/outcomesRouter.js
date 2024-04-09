const express = require('express')

const { getOutcomesList, assignHearingOutcome, updateHearingOutcomeToResulted, updateHearingOutcomeToOnHold, getCase } = require('../../../services/case-service')
const getCaseAndTemplateValues = require('../getCaseTemplateValuesHelper')({ getCase })
const nunjucksFilters = require('../../../utils/nunjucksFilters')

const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList })
const casesInProgressHandler = require('./getCasesInProgressHandler')({ getOutcomesList })
const getResultedCasesHandler = require('./getResultedCasesHandler')({ getOutcomesList })
const getOnHoldCasesHandler = require('./getOnHoldCasesHandler')({ getOutcomesList })
const assignHearingOutcomeRouteHandler = require('./getAssignUserToOutcomeRequestHandler')({ assignHearingOutcome })
const getMoveToResultedHandler = require('./getMoveToResultedHandler')({ updateHearingOutcomeToResulted })
const getMoveToOnHoldHandler = require('./getMoveToOnHoldHandler')({ updateHearingOutcomeToOnHold }, { getCaseAndTemplateValues, nunjucksFilters })
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
outcomesRouter.get('/hearing/:hearingId/defendant/:defendantId/move-to-on-hold', defaults, catchErrors(getMoveToOnHoldHandler))
outcomesRouter.post('/hearing/:hearingId/assign', defaults, catchErrors(assignHearingOutcomeRouteHandler))

module.exports = outcomesRouter
