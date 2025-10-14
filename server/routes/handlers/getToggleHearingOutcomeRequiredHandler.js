const trackEvent = require('../../utils/analytics')

const getToggleHearingOutcomeRequiredHandler = (caseService) => async (req, res) => {
  const {
    params: { courtCode, hearingId, defendantId },
    query: { outcomeNotRequired },
    session
  } = req

  const outcomeNotRequiredBool = outcomeNotRequired === 'true' || outcomeNotRequired === true || outcomeNotRequired === undefined

  try {
    const response = await caseService.toggleHearingOutcomeRequired(hearingId, defendantId, outcomeNotRequiredBool)

    if (response && response.isError) {
      const action = outcomeNotRequiredBool ? 'not required' : 'required'
      console.error(`Error toggling hearing outcome to ${action}:`, response.error || response.message)
      trackEvent('PiCHearingOutcomeToggleError', {
        hearingId,
        defendantId,
        outcomeNotRequired: outcomeNotRequiredBool,
        error: response.error || response.message,
        user: res.locals.user
      })

      const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
      return res.redirect(302, `${errorRedirectUrl}?error=true`)
    }

    trackEvent('PiCHearingOutcomeToggleSuccess', {
      hearingId,
      defendantId,
      outcomeNotRequired: outcomeNotRequiredBool,
      user: res.locals.user
    })

    const redirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
    res.redirect(302, redirectUrl)
  } catch (error) {
    const action = outcomeNotRequiredBool ? 'not required' : 'required'
    console.error(`Exception when toggling hearing outcome to ${action}:`, error)
    trackEvent('PiCHearingOutcomeToggleException', {
      hearingId,
      defendantId,
      outcomeNotRequired: outcomeNotRequiredBool,
      error: error.message,
      user: res.locals.user
    })

    const errorRedirectUrl = session.currentCaseListViewLink || `/${courtCode}/cases`
    res.redirect(302, `${errorRedirectUrl}?error=true`)
  }
}

module.exports = getToggleHearingOutcomeRequiredHandler
