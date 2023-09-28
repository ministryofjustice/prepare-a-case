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

  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

  const templateValues = {
    params: {
      ...params,
      filters: flaggedFilters,
      filtersApplied,
      casesInProgressCount: filtersApplied ? response.cases.length : params.casesInProgressCount
    },
    title,
    currentUserUuid: res.locals.user.uuid,
    moveToResultedSuccess: session.moveToResultedSuccess,
    data: response.cases || []
  }
  session.moveToResultedSuccess = undefined

  res.render('outcomes/casesInProgress', templateValues)
}

module.exports = getCasesInProgressHandler
