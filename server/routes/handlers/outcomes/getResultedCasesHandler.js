const getResultedCasesHandler = caseService => async (req, res) => {
  const {
    params: { courtCode, title, sorts, state },
    params
  } = req

  const filters = []
  const filtersApplied = 0

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
      resultedCasesCount: filtersApplied ? response.cases.length : params.resultedCasesCount
    },
    title,
    data: response.cases || []
  }

  res.render('outcomes/resultedCases', templateValues)
}

module.exports = getResultedCasesHandler
