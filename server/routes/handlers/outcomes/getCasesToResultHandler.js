const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const flagFilters = require('../../../utils/flagFilters')
const getCasesToResultHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params,
    query: queryParams
  } = req

  const response = await caseService.getOutcomesList(courtCode, queryParams, sorts, state)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const filters = flagFilters(queryParams, [getOutcomeTypesListFilters()])

  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      casesInProgressCount: response?.cases?.length || 0,
      casesToResultCount: response?.countsByState?.toResultCount || 0
    },
    title,
    data: response.cases || [],
    displayFilters: response.cases?.length || filtersApplied
  }

  res.render('outcomes/casesToResult', templateValues)
}

module.exports = getCasesToResultHandler
