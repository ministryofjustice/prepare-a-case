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
  const { action } = req.body
  const templateValues = await utils.getCaseAndTemplateValues(req)

  await handleButtonAction(templateValues, action, res, req, utils)
}

const isAssignedToUser = (userUuid, hearingOutcome) => {
  if (!hearingOutcome || !hearingOutcome.assignedToUuid) return false
  return hearingOutcome.assignedToUuid === userUuid
}

const getHearingOutcome = (hearingId, hearings) => {
  const hearing = hearings && hearings.find(p => p.hearingId === hearingId)

  return hearing ? hearing.hearingOutcome : null
}

const handleButtonAction = async (templateValues, action, res, req, utils) => {
  const { caseId, hearingId, defendantId, crn } = templateValues.data
  const { courtCode } = templateValues.params

  switch (action) {
    case 'unlinkNdelius':
      return res.redirect(`/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/unlink/${crn}`)
    case 'linkNdelius':
      return res.redirect(`/${courtCode}/case/${caseId}/hearing/${hearingId}/match/defendant/${defendantId}/manual`)
    case 'moveToResulted':
      await moveToResulted(res, req, utils, templateValues)
  }
}

const moveToResulted = async (res, req, utils, templateValues) => {
  const { params: { courtCode, hearingId, defendantId } } = req
  const { apostropheInName, properCase, removeTitle } = utils.nunjucksFilters
  const { defendantName } = templateValues.data
  const correlationId = uuidv4()

  try {
    await utils.updateHearingOutcomeToResulted(hearingId, defendantId, correlationId)
    const formattedName = removeTitle(properCase(apostropheInName(defendantName)))

    req.flash('moved-to-resulted', `You have moved ${formattedName}'s case to resulted cases.`)
  } catch (e) {
    if (e.response.status === 403 || e.response.status === 401) {
      req.flash('global-error', 'Request was unsuccessful. Check that you are still assigned to the case you are trying to result.')
    } else {
      req.flash('global-error', e.message)
    }
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
  const { probationStatus, crn, hearingId, hearings, assignedToCurrentUser } = templateValues.data
  const hearingOutcome = getHearingOutcome(hearingId, hearings)
  const buttons = []

  const createButton = (text, value, enabled = true) => ({
    text,
    name: 'action',
    value,
    classes: 'common_checker_toggle_action govuk-button--secondary',
    disabled: !enabled
  })

  if (probationStatus === 'No record') {
    buttons.push(createButton('Link NDelius Record', 'linkNdelius'))
  } else if ((crn && crn.length) > 0 && !hideUnlinkButton) {
    buttons.push(createButton('Unlink NDelius Record', 'unlinkNdelius'))
  }
  if (hearingOutcome && settings.enableMoveToResultedAction) {
    buttons.push(createButton('Move to resulted', 'moveToResulted', assignedToCurrentUser && hearingOutcome.state === 'IN_PROGRESS'))
  }

  return buttons.length > 0 ? buttons : null
}

module.exports = caseSummaryHandler
