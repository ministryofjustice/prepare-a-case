const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')
const workflow = require('../../utils/workflow')
const queryParamBuilder = require('../../utils/queryParamBuilder.js')
const moment = require('moment')

const getTodaysDate = () => {
  return moment(new Date()).format('YYYY-MM-DD')
}

const createBaseUrl = (params, queryParams) => {
  const { page, ...remainder } = queryParams
  const builtQueryParamString = queryParamBuilder(remainder)
  const questionMark = builtQueryParamString.length > 0

  const date = params.date ? params.date : getTodaysDate()

  return `/${params.courtCode}/cases/${date}?${queryParamBuilder(remainder)}${questionMark ? '&' : ''}`
}

const getPagelessQueryParams = params => {
  const { page, ...remainder } = params
  return remainder
}

const getPagedCaseListRouteHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: queryParams,
    session,
    path,
    params
  } = req

  const selectedFilters = queryParams
  const currentNotification = await getAsync('case-list-notification')
  const currentDate = date || getBaseDateString()
  const context = { court: courtCode, username: res.locals.user.username }
  const hearingOutcomesEnabled = features.hearingOutcomes.isEnabled(context)
  const workflowEnabled = features.workflow.isEnabled(context)
  const response = await caseService.getPagedCaseList(courtCode, currentDate, selectedFilters, subsection || (!date && session.currentView), queryParams.page, settings.casesPerPage, hearingOutcomesEnabled)
  if (response.isError) {
    trackEvent(
      'PiCPrepareACaseErrorTrace',
      {
        operation: ' getPagedCaseListRouteHandler [caseService.getPagedCaseList]',
        req,
        response
      }
    )
    res.render('error', { status: response.status || 500 })
    return
  }

  const caseCount = response.totalElements
  const startCount = ((parseInt(queryParams.page, 10) - 1) || 0) * limit
  const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)

  const pastCaseNavigationEnabled = features.pastCasesNavigation.isEnabled(context)

  // God I hate myself for this...

  response.cases.forEach(cases => (cases.workflow = {
    tasks: [
      {
        id: 'prep',
        state: cases.hearingPrepStatus
      }
    ]
  }))

  if (workflowEnabled) {
    response.cases
      .forEach((myCase, i) => {
        const { workflow: myWorkflow } = myCase
        if (!myWorkflow) {
          throw new TypeError(`Array[${i}] missing workflow key`)
        }
        if (!myWorkflow.tasks) {
          throw new TypeError(`Array[${i}] missing workflow.tasks key`)
        }

        myWorkflow.tasks = {
          prep: workflow.tasks.get('prep').states.getById(myWorkflow.tasks
            .find(({ id }) => id === 'prep').state)
        }
      })
  }

  const templateValues = {
    title: 'Cases',
    params: {
      ...params,
      workflow: {
        enabled: workflowEnabled,
        tasks: {
          prep: {
            items: workflow.tasks.get('prep').states.getAllOrderBySequence
          }
        }
      },
      hearingOutcomesEnabled,
      date: currentDate,
      notification: currentNotification || '',
      filters: response.filters,
      page: parseInt(queryParams.page, 10) || 1,
      from: startCount,
      to: endCount,
      caseCount,
      addedCount: response.recentlyAddedCount,
      unmatchedRecords: response.possibleMatchesCount,
      removedCount: response.removedCount,
      totalDays: pastCaseNavigationEnabled ? settings.casesTotalDays : 7,
      casesPastDays: pastCaseNavigationEnabled ? settings.casesPastDays : -1,
      enablePastCasesNavigation: settings.enablePastCasesNavigation,
      subsection: subsection || (!date && session.currentView) || '',
      filtersApplied: !!getPagelessQueryParams(queryParams) && Object.keys(getPagelessQueryParams(queryParams)).length > 0,
      baseUrl: createBaseUrl({ courtCode, date }, queryParams)
    },
    data: response.cases,
    hearingOutcomesEnabled
  }
  session.currentView = subsection

  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink
  res.render('case-list', templateValues)
}

module.exports = getPagedCaseListRouteHandler
