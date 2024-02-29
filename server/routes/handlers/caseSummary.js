const moment = require('moment')
const getNextHearing = require('../../utils/getNextHearing')
const featuresToggles = require('../../utils/features')

const {
  settings
} = require('../../config')

const caseSummaryHandler = utils => async (req, res) => {
  if (req.method === 'POST') {
    return caseSummaryPostHandler(req, res)
  }
  // build outcome types list for select controls
  const outcomeTypeItems = utils.getOutcomeTypesListFilters().items
  const outcomeTypes = [
    ...[{ value: '', text: 'Outcome type' }],
    ...outcomeTypeItems.filter(item => item.value !== 'NO_OUTCOME').map(item => { return { text: item.label, value: item.value } })
  ]

  const { session, path, params: { courtCode } } = req
  const templateValues = await utils.getCaseAndTemplateValues(req)
  templateValues.title = 'Case summary'
  templateValues.session = {
    ...session
  }
  session.deleteCommentSuccess = undefined
  session.deleteHearingNoteSuccess = undefined
  session.addHearingOutcomeSuccess = undefined
  session.editHearingOutcomeSuccess = undefined
  session.assignHearingOutcomeSuccess = undefined
  templateValues.data.caseComments = templateValues.data.caseComments?.sort((a, b) => {
    return moment(b.created).unix() - moment(a.created).unix()
  })
  templateValues.data.nextAppearanceHearingId = templateValues.data.hearings &&
      getNextHearing(templateValues.data.hearings, moment(), templateValues.data.source)?.hearingId
  templateValues.data.hearings = templateValues.data.hearings?.sort((a, b) => {
    return moment(b.hearingDateTime).unix() - moment(a.hearingDateTime).unix()
  })
  templateValues.data.hearings?.forEach(hearing => {
    hearing.notes = hearing.notes?.sort((a, b) => {
      return moment(b.created).unix() - moment(a.created).unix()
    })
  })

  templateValues.data.files ||= [] // TODO: compatibility until the backend has caught up, remove when so
  templateValues.data.files
    .forEach(file => {
      file.datetime = moment(file.datetime).format('D MMMM YYYY')
    })

  templateValues.data.actionButtonItems = [
    {
      text: 'Unlink NDelius Record',
      name: 'unlinkNdelius',
      value: `${courtCode}/case/${templateValues.data.caseId}/hearing/${templateValues.data.hearingId}/match/defendant/${templateValues.data.defendantId}/unlink/${templateValues.data.crn}`,
      classes: 'common_checker_toggle_action govuk-button--secondary'
    }
  ]

  templateValues.config = { ...settings.case }

  templateValues.enableCaseHistory = settings.enableCaseHistory
  templateValues.currentUserUuid = res.locals.user.uuid
  const context = { court: courtCode, username: res.locals.user.username, sourceType: templateValues.data.source }
  const hearingOutcomesEnabled = featuresToggles.hearingOutcomes.isEnabled(context)
  templateValues.params.hearingOutcomesEnabled = hearingOutcomesEnabled
  templateValues.features = {
    hearingNotes: featuresToggles.hearingNotes.isEnabled(context),
    hearingOutcomesEnabled,
    caseDefendantDocuments: settings.enableCaseDefendantDocuments
  }
  templateValues.outcomeTypes = outcomeTypes
  session.confirmedMatch = undefined
  session.matchName = undefined
  session.matchType = 'defendant'
  session.matchDate = undefined
  session.backLink = path
  session.caseCommentBlankError = undefined
  res.render('case-summary', templateValues)
}

const caseSummaryPostHandler = async (req, res) => {
  console.log('🚀 ~ caseSummaryPostHandler ~ res.body:', req.body)
  res.redirect(`/${req.body.unlinkNdelius}`)
}

module.exports = caseSummaryHandler
