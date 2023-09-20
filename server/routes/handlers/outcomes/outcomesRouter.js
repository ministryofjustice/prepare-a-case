const express = require('express')

const { getOutcomesList, updateHearingOutcomeToResulted } = require('../../../services/case-service')
const casesToResultHandler = require('./getCasesToResultHandler')({ getOutcomesList })
const casesInProgressHandler = require('./getCasesInProgressHandler')({ getOutcomesList })
const getResultedCasesHandler = require('./getResultedCasesHandler')({ getOutcomesList })
const getMoveToResultedHandler = require('./getMoveToResultedHandler')({ updateHearingOutcomeToResulted })

const { defaults } = require('../../middleware/defaults')
const catchErrors = require('../catchAsyncErrors')
const outcomesMiddleware = require('../../middleware/outcomesMiddleware')

const outcomesRouter = express.Router({ mergeParams: true })

outcomesRouter.get('/', defaults, outcomesMiddleware('NEW'), catchErrors(casesToResultHandler))
outcomesRouter.get('/in-progress', defaults, outcomesMiddleware('IN_PROGRESS'), catchErrors(casesInProgressHandler))
outcomesRouter.get('/resulted-cases', defaults, outcomesMiddleware('RESULTED'), catchErrors(getResultedCasesHandler))
outcomesRouter.get('/:hearingId/move-to-resulted', defaults, catchErrors(getMoveToResultedHandler))

module.exports = outcomesRouter
