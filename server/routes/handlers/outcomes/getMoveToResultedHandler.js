const trackEvent = require('../../../utils/analytics')
const { v4: uuidv4 } = require('uuid')
const getMoveToResultedHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, session } = req
  const correlationId = uuidv4()

  try {
    await caseService.updateHearingOutcomeToResulted(hearingId, defendantId, correlationId)
    session.moveToResultedSuccess = req.query.defendantName
  } catch (e) {
    if (e.response.status === 403 || e.response.status === 401) {
      req.flash('global-error', 'Request was unsuccessful. Check that you are still assigned to the case you are trying to result.')
    } else {
      req.flash('global-error', e.message)
    }
  }

  trackEvent(
    'PiCPrepareACaseHearingOutcomes',
    {
      operation: 'updateHearingOutcomeToResulted',
      hearingId,
      courtCode,
      defendantId,
      correlationId,
      userId: res.locals.user.uuid,
      user: res.locals.user
    }
  )

  res.redirect(`/${courtCode}/outcomes/in-progress`)
}

module.exports = getMoveToResultedHandler
