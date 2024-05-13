const trackEvent = require('../../../utils/analytics')
const getMoveToResultedHandler = (caseService, utils) => async (req, res) => {
  const { params: { courtCode, hearingId, defendantId } } = req
  const templateValues = await utils.getCaseAndTemplateValues(req)
  const { apostropheInName, properCase, removeTitle } = utils.nunjucksFilters
  const formattedName = removeTitle(properCase(apostropheInName(templateValues.data.defendantName)))

  const bannerText = `You have moved ${formattedName}'s case to on hold.`

  req.flash('move-to-on-hold', bannerText)

  await caseService.updateHearingOutcomeToOnHold(hearingId, defendantId)

  trackEvent(
    'PiCPrepareACaseHearingOutcomes',
    {
      operation: 'updateHearingOutcomeToOnHold',
      hearingId,
      courtCode,
      userId: res.locals.user.userId
    }
  )

  res.redirect(`/${courtCode}/outcomes/on-hold`)
}

module.exports = getMoveToResultedHandler
