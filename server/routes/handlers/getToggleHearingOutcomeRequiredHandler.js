const trackEvent = require('../../utils/analytics')

const getToggleHearingOutcomeRequiredHandler = (caseService) => async (req, res) => {
  const {
    params: { courtCode, hearingId, defendantId },
    query: { outcomeNotRequired, defendantName },
    session
  } = req

  const isOutcomeNotRequired = outcomeNotRequired === 'true' || outcomeNotRequired === true || outcomeNotRequired === undefined

  try {
    const response = await caseService.toggleHearingOutcomeRequired(hearingId, defendantId, isOutcomeNotRequired)

    if (response && response.isError) {
      const action = isOutcomeNotRequired ? 'not required' : 'required'
      console.error(`Error toggling hearing outcome to ${action}:`, response.error || response.message)
      trackEvent('PiCHearingOutcomeToggleError', {
        hearingId,
        defendantId,
        outcomeNotRequired: isOutcomeNotRequired,
        error: response.error || response.message,
        user: res.locals.user
      })

      req.flash('global-error', 'Request was unsuccessful. Please try again.')
      const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
      return res.redirect(302, errorRedirectUrl)
    }

    trackEvent('PiCHearingOutcomeToggleSuccess', {
      hearingId,
      defendantId,
      outcomeNotRequired: isOutcomeNotRequired,
      user: res.locals.user
    })

    if (isOutcomeNotRequired === true) {
      req.flash('toggle-outcome-success', defendantName ? `You have moved ${defendantName} to the Hearing outcome not required tab` : 'Case moved to the Hearing outcome not required tab')
    } else {
      req.flash('toggle-outcome-success', defendantName ? `You have moved ${defendantName} to the Hearing outcome still to be added tab` : 'Case moved to the Hearing outcome still to be added tab')
    }

    const redirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
    res.redirect(302, redirectUrl)
  } catch (error) {
    const action = isOutcomeNotRequired ? 'not required' : 'required'
    console.error(`Exception when toggling hearing outcome to ${action}:`, error)
    trackEvent('PiCHearingOutcomeToggleException', {
      hearingId,
      defendantId,
      outcomeNotRequired: isOutcomeNotRequired,
      error: error.message,
      user: res.locals.user
    })

    req.flash('global-error', error.message || 'Request was unsuccessful. Please try again.')
    const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
    res.redirect(302, errorRedirectUrl)
  }
}

module.exports = getToggleHearingOutcomeRequiredHandler
