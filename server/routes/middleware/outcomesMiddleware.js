const getOutcomeListSorts = require('../../utils/getOutcomesSorts')
const features = require('../../utils/features')
const log = require('../../../log')
const { settings } = require('../../../config')
const outcomesMiddleware = state => async (req, res, next) => {
  const context = { court: req.params.courtCode, username: res.locals.user.username }

  const hearingOutcomesEnabled = features.hearingOutcomes.isEnabled(context)

  if (!hearingOutcomesEnabled) { // prevents anyone using the direct link
    log.warn('Hearing outcomes not enabled', context)
    res.sendStatus(400)
    return
  }

  const {
    params,
    query
  } = req

  // sorting by hearing date is common to all outcomes pages
  const sorts = getOutcomeListSorts(req.query)

  const sortMapping = {
    NONE: 'none',
    ASC: 'ascending',
    DESC: 'descending'
  }
  const hearingDateSort = sortMapping[sorts && sorts.map(item => item.value).pop()]

  const paramMap = new URLSearchParams({
    state
  })

  Object.keys(query).filter(key => !['page', 'state'].includes(key)).forEach(key => {
    const values = query[key]
    if (values) {
      if (Array.isArray(values)) {
        values.forEach(val => paramMap.append(key, val))
      } else {
        paramMap.append(key, values)
      }
    }
  })

  const pagingBaseUrl = `${state === 'NEW' ? '' : (state === 'IN_PROGRESS' ? 'in-progress' : 'resulted-cases')}?${paramMap.toString()}`

  req.params = {
    ...params,
    title: 'Hearing outcomes',
    sorts,
    hearingDateSort,
    state,
    hearingOutcomesEnabled,
    pageSize: settings.hearingOutcomesPageSize,
    currentPage: parseInt(query.page || 1, 10),
    pagingBaseUrl
  }
  next()
}

module.exports = outcomesMiddleware
