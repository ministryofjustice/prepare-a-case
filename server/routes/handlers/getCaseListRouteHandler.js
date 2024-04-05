const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../config')
const features = require('../../utils/features')
const trackEvent = require('../../utils/analytics.js')
const workflow = require('../../utils/workflow')

const getCaseListRouteHandler = caseService => async (req, res) => {
  const {
    redisClient: { getAsync },
    params: { courtCode, date, limit, subsection },
    query: { page },
    session,
    path,
    params
  } = req
  const currentNotification = await getAsync('case-list-notification')
  const currentDate = date || getBaseDateString()
  const response = await caseService.getCaseList(courtCode, currentDate, session.selectedFilters, subsection || (!date && session.currentView))
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
  const startCount = ((parseInt(page, 10) - 1) || 0) * limit
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
      page: parseInt(page, 10) || 1,
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
      filtersApplied: !!session.selectedFilters && Object.keys(session.selectedFilters).length,
      snapshot: response.snapshot
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
