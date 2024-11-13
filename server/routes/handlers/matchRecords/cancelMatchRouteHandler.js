const trackEvent = require('../../../utils/analytics')
const { settings } = require('../../../config')

const cancelMatchRouteHandler = (req, res) => {
  const { courtCode } = req.params
  const { matchType, matchDate, hearingId, defendantId } = req.session

  const backUrl =
      matchType === 'bulk'
        ? `/${courtCode}/match/${matchType}/${matchDate}`
        : `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`

  if (settings.enableMatcherLogging) {
    trackEvent('PiCMatcherCancelLinkClicked', courtCode, matchType, matchDate, hearingId, defendantId)
  }

  res.redirect(backUrl)
}

module.exports = cancelMatchRouteHandler
