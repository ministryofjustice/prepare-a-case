const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getCasesToResultHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
  } = req

  const filters = getOutcomeTypesListFilters(req.query)

  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

  const response = await caseService.getOutcomesList(courtCode, filters, sorts, state)
  if (response && response.isError !== undefined && response.isError) {
    res.render('error', { status: response.status || 500 })
    return
  }

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      casesToResultCount: filtersApplied ? response.cases.length : params.casesToResultCount
    },
    title,
    data: response.cases || []
  }

  res.render('outcomes/casesToResult', templateValues)
}

module.exports = getCasesToResultHandler
