const trackEvent = require('../../utils/analytics')

const getCancelMatchRouteHandler = (req, res) => {
  const { courtCode } = req.params
  const { matchType, matchDate, hearingId, defendantId } = req.session

  const backUrl =
      matchType === 'bulk'
        ? `/${courtCode}/match/${matchType}/${matchDate}`
        : `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`

  trackEvent('PiCMatcherCancelLinkClicked', {
    action: 'Cancel match defendant',
    courtCode,
    matchType,
    backUrl
  })

  res.redirect(backUrl)
}

module.exports = getCancelMatchRouteHandler
