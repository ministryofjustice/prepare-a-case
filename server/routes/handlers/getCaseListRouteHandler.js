const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')
const queryParamBuilder = require('../../utils/queryParamBuilder.js')
const workflow = require('../../utils/workflow')


const createBaseUrl = (params, queryParams) => {
  const { page, ...remainder } = queryParams
  const builtQueryParamString = queryParamBuilder(remainder)
  const questionMark = builtQueryParamString.length > 0
  return `/${params.courtCode}/cases/${params.date}?${queryParamBuilder(remainder)}${questionMark ? '&' : ''}`
}

const getPagelessQueryParams = params => {
  const { page, ...remainder } = params
  return remainder
}
const getCaseListRouteHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: queryParams,
    session,
    path,
    params
  } = req
  const currentNotification = await getAsync('case-list-notification')
  const currentDate = date || getBaseDateString()
  const response = await caseService.getCaseList(courtCode, currentDate, queryParams, subsection || (!date && session.currentView))

  if (response.isError) {
    trackEvent(
      'PiCPrepareACaseErrorTrace',
      {
        operation: ' getCaseListRouteHandler [caseService.getCaseList]',
        req,
        response
      }
    )
    res.render('error', { status: response.status || 500 })
    return
  }

  /* PIC-3622 prep status data mapper - workflow start */
  if (settings.enableWorkflow) {
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

  const caseCount = response.cases.length
  const startCount = ((parseInt(queryParams.page, 10) - 1) || 0) * limit
  const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)

  const context = { court: courtCode, username: res.locals.user.username }
  const pastCaseNavigationEnabled = features.pastCasesNavigation.isEnabled(context)
  const hearingOutcomesEnabled = features.hearingOutcomes.isEnabled(context)

  const templateValues = {
    title: 'Cases',
    params: {
      ...params,
      workflow: {
        enabled: settings.enableWorkflow,
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
      totalCount: response.totalCount,
      caseCount,
      addedCount: response.addedCount,
      removedCount: response.removedCount,
      unmatchedRecords: response.unmatchedRecords,
      totalDays: pastCaseNavigationEnabled ? settings.casesTotalDays : 7,
      casesPastDays: pastCaseNavigationEnabled ? settings.casesPastDays : -1,
      enablePastCasesNavigation: settings.enablePastCasesNavigation,
      subsection: subsection || (!date && session.currentView) || '',
      filtersApplied: !!getPagelessQueryParams(queryParams) && Object.keys(getPagelessQueryParams(queryParams)).length > 0,
      snapshot: response.snapshot,
      baseUrl: createBaseUrl(params, queryParams)
    },
    data: response.cases.slice(startCount, endCount) || [],
    hearingOutcomesEnabled
  }
  session.currentView = subsection

  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink
  res.render('case-list', templateValues)
}

module.exports = getCaseListRouteHandler
