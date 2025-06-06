const { getMatchedUrl } = require('../../helpers')
const { settings } = require('../../../config')
const trackEvent = require('../../../utils/analytics')
const defendantMatchRouteHandler = (updateCaseDetails) => async (req, res) => {
  const {
    params: { courtCode, caseId, defendantId, hearingId },
    body: { crn, matchProbability },
    session
  } = req

  const tryAgainRedirect = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}`
  let redirectUrl

  if (!crn) {
    session.confirmedMatch = undefined
    session.formError = true
    redirectUrl = tryAgainRedirect
  } else {
    try {
      const response = await updateCaseDetails(caseId, hearingId, defendantId, crn)
      if (response.status === 200) {
        session.confirmedMatch = {
          name: session.matchName,
          matchType: 'Known',
          matchProbability
        }

        if (settings.enableMatcherLogging) {
          trackEvent('PiCMatcherLogging', response)
          if (matchProbability[0] <= 0.5) {
            trackEvent('PiCMatcherLessRelevantMatchSelected', caseId, hearingId, defendantId, crn)
          } else {
            trackEvent('PiCMatcherMoreRelevantMatchSelected', caseId, hearingId, defendantId, crn)
          }
        }

        redirectUrl = `/${getMatchedUrl(session.matchType, session.matchDate, hearingId, defendantId, courtCode)}`
      } else {
        session.serverError = true
        redirectUrl = tryAgainRedirect
      }
    } catch (error) {
      session.serverError = true
      redirectUrl = tryAgainRedirect
    }
  }

  res.redirect(302, redirectUrl)
}

module.exports = defendantMatchRouteHandler
