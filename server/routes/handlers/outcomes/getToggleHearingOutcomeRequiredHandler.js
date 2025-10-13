const trackEvent = require('../../../utils/analytics')

const getToggleHearingOutcomeRequiredHandler = caseService => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId }, query } = req
  const hearingOutcomeRequired = query.hearingOutcomeRequired === 'true'
  const defendantName = query.defendantName

  try {
    await caseService.toggleHearingOutcomeRequired(hearingId, defendantId, hearingOutcomeRequired)
    if (hearingOutcomeRequired === false) {
      req.flash('toggle-outcome-success', `You have moved ${defendantName} to the hearing outcome not required tab in cases`)
    } else {
      req.flash('toggle-outcome-success', `You have moved ${defendantName} to the hearing outcome still to be added tab in cases`)
    }
  } catch (e) {
    if (e.response?.status === 403 || e.response?.status === 401) {
      req.flash('global-error', 'Request was unsuccessful. Please try again.')
    } else {
      req.flash('global-error', e.message)
    }
  }

  trackEvent(
    'PiCPrepareACaseHearingOutcomes',
    {
      operation: 'toggleHearingOutcomeRequired',
      hearingId,
      courtCode,
      defendantId,
      hearingOutcomeRequired,
      userId: res.locals.user.uuid,
      user: res.locals.user
    }
  )

  res.redirect(`/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`)
}

module.exports = getToggleHearingOutcomeRequiredHandler
