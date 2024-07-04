const moment = require('moment')
const getNextHearing = require('../../utils/getNextHearing')
const featuresToggles = require('../../utils/features')
const trackEvent = require('../../utils/analytics')
const { v4: uuidv4 } = require('uuid')

const {
  settings
} = require('../../config')

const caseSummaryHandler = utils => async (req, res) => {
  if (req.method === 'POST') {
    return caseSummaryPostHandler(utils)(req, res)
  }
  // build outcome types list for select controls
  const outcomeTypeList = await utils.getOutcomeTypesListFilters()
  const outcomeTypeItems = outcomeTypeList.items

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

  templateValues.data.assignedToCurrentUser = isAssignedToUser(
    res.locals.user.uuid,
    getHearingOutcome(templateValues.data.hearingId, templateValues.data.hearings)
  )

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
    caseDefendantDocuments: hearingOutcomesEnabled
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

const caseSummaryPostHandler = utils => async (req, res) => {
}

const isAssignedToUser = (userUuid, hearingOutcome) => {
  if (!hearingOutcome || !hearingOutcome.assignedToUuid) return false
  return hearingOutcome.assignedToUuid === userUuid
}

const getHearingOutcome = (hearingId, hearings) => {
  const hearing = hearings && hearings.find(p => p.hearingId === hearingId)

  return hearing ? hearing.hearingOutcome : null
}

trackEvent(
  'PiCPrepareACaseHearingOutcomes',
  {
    operation: 'updateHearingOutcomeToResultedFromDefendantSummary',
    hearingId,
    courtCode,
    defendantId,
    correlationId,
    userId: res.locals.user.uuid,
    user: res.locals.user
  }
)

res.redirect(`/${courtCode}/outcomes/in-progress`)
}

const getActionButtons = (templateValues) => {
  const { hideUnlinkButton } = templateValues
  const { probationStatus, crn, hearingId, hearings, assignedToCurrentUser, defendantId, defendantName, caseId } = templateValues.data
  const { courtCode } = templateValues.params
  const hearingOutcome = getHearingOutcome(hearingId, hearings)
  const buttons = []

  const createButton = (text, value, href, enabled = true) => ({
    text,
    name: 'action',
    value,
    classes: 'common_checker_toggle_action govuk-button--secondary',
    disabled: !enabled,
    href
  })

  if (probationStatus === 'No record') {
    const linkRecordLink = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/manual`
    buttons.push(createButton('Link NDelius Record', 'linkNdelius', linkRecordLink))
  } else if ((crn && crn.length) > 0 && !hideUnlinkButton) {
    const unlinkRecordLink = `/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/unlink/${crn}`
    buttons.push(createButton('Unlink NDelius Record', 'unlinkNdelius', unlinkRecordLink))
  }
  if (hearingOutcome && settings.enableMoveToResultedAction) {
    const resultedLink = `/${courtCode}/outcomes/hearing/${hearingId}/defendant/${defendantId}/move-to-resulted?defendantName=${defendantName}`
    buttons.push(createButton('Move to resulted', 'moveToResulted', resultedLink, assignedToCurrentUser && hearingOutcome.state === 'IN_PROGRESS'))
  }

  return buttons.length > 0 ? buttons : null
}

module.exports = caseSummaryHandler
