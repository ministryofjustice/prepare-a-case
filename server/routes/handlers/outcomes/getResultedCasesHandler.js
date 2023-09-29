const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getHearingOutcomeAssignedToFilters = require('../../../utils/getHearingOutcomeAssignedToFilters')
const flagFilters = require('../../../utils/flagFilters')

const getResultedCasesHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
  } = req

  const response = await caseService.getOutcomesList(courtCode, req.query, sorts, state)

  const cases = response.cases

  const filters = [getOutcomeTypesListFilters()]
  const assignedToFilter = getHearingOutcomeAssignedToFilters(cases, req.query)

  if (assignedToFilter) {
    filters.push(assignedToFilter)
  }

  const flaggedFilters = flagFilters(req.query, filters)

  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

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
    data: cases || [],
    displayFilters: response.cases?.length || filtersApplied
  }

  res.render('outcomes/resultedCases', templateValues)
}

module.exports = getResultedCasesHandler
