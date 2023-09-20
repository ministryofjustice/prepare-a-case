const getOutcomeTypesListFilters = require('../../../utils/getOutcomeTypesListFilters')
const getResultedCasesHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
  } = req

  const filters = getOutcomeTypesListFilters(req.query)
  const filtersApplied = filters.map(filterObj => filterObj.items.filter(item => item.checked).length).pop()

  const response = await caseService.getOutcomesList(courtCode, filters, sorts, state)

  const templateValues = {
    params: {
      ...params,
      filters,
      filtersApplied,
      resultedCasesCount: filtersApplied ? response.cases.length : params.resultedCasesCount
    },
    title,
    currentUserUuid: res.locals.user.uuid,
    data: response.cases || []
  }

  res.render('outcomes/resultedCases', templateValues)
}

module.exports = getResultedCasesHandler
