const getBaseDateString = require('../../utils/getBaseDateString')
const { settings } = require('../../../config')
const features = require('../../utils/features')

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
  const response = await caseService.getCaseList(courtCode, currentDate, session.selectedFilters, subsection || (!date && session.currentView), page)
  if (response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }
  const caseCount = !subsection ? response.totalCount : subsection === 'added' ? response.addedCount : response.removedCount
  const startCount = ((parseInt(page, 10) - 1) || 0) * limit
  const endCount = Math.min(startCount + parseInt(limit, 10), caseCount)

  const context = { court: courtCode, username: res.locals.user.username }
  const pastCaseNavigationEnabled = features.pastCasesNavigation.isEnabled(context)
  const templateValues = {
    title: 'Cases',
    params: {
      ...params,
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
    data: response.cases.slice(startCount, endCount) || []
  }
  session.currentView = subsection

  session.caseListDate = currentDate
  session.currentCaseListViewLink = `${path}?page=${templateValues.params.page}`
  session.backLink = session.currentCaseListViewLink
  res.render('case-list', templateValues)
}

module.exports = getCaseListRouteHandler
