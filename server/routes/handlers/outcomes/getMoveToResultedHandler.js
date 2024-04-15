const trackEvent = require('../../../utils/analytics')
const getMoveToResultedHandler = (caseService, utils) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId } } = req
  const { defendantName, redirectPage } = req.query
  const { apostropheInName, properCase, removeTitle } = utils.nunjucksFilters
  const formattedName = removeTitle(properCase(apostropheInName(defendantName)))

  await caseService.updateHearingOutcomeToResulted(hearingId, defendantId)

  trackEvent(
    'PiCPrepareACaseHearingOutcomes',
    {
      operation: 'updateHearingOutcomeToResulted',
      hearingId,
      courtCode,
      userId: res.locals.user.userId
    }
  )

  const redirectUrl = redirectPage ?? 'in-progress'

  req.flash('moved-to-resulted', `You have moved ${formattedName}'s case to resulted cases.`)

  res.redirect(`/${courtCode}/outcomes/${redirectUrl}`)
}

module.exports = getMoveToResultedHandler
