const trackEvent = require('../../utils/analytics')

const getToggleHearingOutcomeRequiredHandler = (caseService) => async (req, res) => {
  const {
    params: { courtCode, hearingId, defendantId },
    query: { outcomeNotRequired },
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

      const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
      return res.redirect(302, `${errorRedirectUrl}?error=true`)
    }

    trackEvent('PiCHearingOutcomeToggleSuccess', {
      hearingId,
      defendantId,
      outcomeNotRequired: isOutcomeNotRequired,
      user: res.locals.user
    })

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

    const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
    res.redirect(302, `${errorRedirectUrl}?error=true`)
  }
}

module.exports = getToggleHearingOutcomeRequiredHandler
