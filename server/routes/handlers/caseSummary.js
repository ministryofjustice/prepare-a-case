const moment = require('moment')
const getNextHearing = require('../../utils/getNextHearing')
const featuresToggles = require('../../utils/features')

const {
  settings
} = require('../../config')

const caseSummaryHandler = utils => async (req, res) => {
  console.log('flash message', req.flash('test'))
  if (req.method === 'POST') {
    return caseSummaryPostHandler(utils)(req, res)
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

  templateValues.data.actionButtonItems = getActionButtons(templateValues)

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

  // templateValues.data.probationStatus = 'No record'

  res.render('case-summary', templateValues)
}

const caseSummaryPostHandler = utils => async (req, res) => {
  const { action } = req.body
  const templateValues = await utils.getCaseAndTemplateValues(req)

  req.flash('test', 'test message')
  handleButtonAction(templateValues, action, res)
}

const getHearingOutcome = (hearingId, hearings) => {
  const hearing = hearings.find(p => p.hearingId === hearingId)

  return hearing ? hearing.hearingOutcome : null
}

const handleButtonAction = (templateValues, action, res) => {
  const { caseId, hearingId, defendantId, crn, courtCode } = templateValues.data

  switch (action) {
    case 'unlinkNdelius':
      return res.redirect(`/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/unlink/${crn}`)
    case 'linkNdelius':
      return res.redirect(`/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/manual`)
    case 'moveToResulted':
      console.log('moveToResulted')
      res.redirect('/hearing/7e0f9cb9-b492-4657-9028-a86de1301e25/defendant/81b6e516-4e9d-4c92-a38b-68e159cfd6c4/summary')
      break
  }
}

const getActionButtons = (templateValues) => {
  const { hideUnlinkButton } = templateValues
  const { probationStatus, crn, hearingId, hearings } = templateValues.data
  const hearingOutcome = getHearingOutcome(hearingId, hearings)
  const buttons = []

  const createButton = (text, value) => ({
    text,
    name: 'action',
    value,
    classes: 'common_checker_toggle_action govuk-button--secondary'
  })

  if (probationStatus === 'No record') {
    buttons.push(createButton('Link NDelius Record', 'linkNdelius'))
  } else if ((crn && crn.length) > 0 && !hideUnlinkButton) {
    buttons.push(createButton('Unlink NDelius Record', 'unlinkNdelius'))
  }
  if (hearingOutcome && hearingOutcome.state === 'IN_PROGRESS') {
    buttons.push(createButton('Move to resulted', 'moveToResulted'))
  }

  return buttons.length > 0 ? buttons : null
}

module.exports = caseSummaryHandler
