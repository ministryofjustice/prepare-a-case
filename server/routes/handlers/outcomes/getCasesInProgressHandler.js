const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getHearingOutcomeAssignedToFilters = require('../../../utils/getHearingOutcomeAssignedToFilters')
const flagFilters = require('../../../utils/flagFilters')

const getCasesInProgressHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    session,
    query: queryParams
  } = req

  const response = await caseService.getOutcomesList(courtCode, queryParams, sorts, state)

  const cases = response.cases

  const filters = [getOutcomeTypesListFilters()]
  const assignedToFilter = getHearingOutcomeAssignedToFilters(cases, queryParams)

  if (assignedToFilter) {
    filters.push(assignedToFilter)
  }

  const flaggedFilters = flagFilters(queryParams, filters)

  const filtersApplied = flaggedFilters.map(filterObj => filterObj.items.filter(item => item.checked).length).some(length => length > 0)

  const templateValues = {
    params: {
      ...params,
      filters: flaggedFilters,
      filtersApplied,
      casesInProgressCount: response?.countsByState?.inProgressCount || 0,
      casesToResultCount: response?.countsByState?.toResultCount || 0
    },
    title,
    currentUserUuid: res.locals.user.uuid,
    moveToResultedSuccess: session.moveToResultedSuccess,
    data: response.cases || [],
    displayFilters: response.cases?.length || filtersApplied,
    totalPages: response.totalPages,
    totalElements: response.totalElements
  }
  session.moveToResultedSuccess = undefined

  res.render('outcomes/casesInProgress', templateValues)
}

module.exports = getCasesInProgressHandler
