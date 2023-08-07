const getOutcomeListSorts = require('../../../utils/getOutcomesSorts')
const outcomesMiddleware = state => async (req, res, next) => {
  const {
    params
  } = req

  // sorting by hearing date is common to all outcomes pages
  const sorts = getOutcomeListSorts(req.query)

  const sortMapping = {
    NONE: 'none',
    ASC: 'ascending',
    DESC: 'descending'
  }
  const hearingDateSort = sortMapping[sorts && sorts.map(item => item.value).pop()]

  req.params = {
    ...params,
    title: 'Hearing outcomes',
    sorts,
    casesToResultCount: 2,
    casesInProgressCount: 0,
    resultedCasesCount: 0,
    hearingDateSort,
    state
  }
  next()
}

module.exports = outcomesMiddleware
