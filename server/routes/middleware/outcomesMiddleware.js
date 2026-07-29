const getOutcomeListSorts = require('../../utils/getOutcomesSorts')
const features = require('../../utils/features')
const log = require('../../log')
const { settings } = require('../../config')
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
  let sorts = getOutcomeListSorts(req.query)

  if (query.defendantName || query.probationStatus) {
    sorts = sorts.filter(sort => sort.id !== 'hearingDate')

    if (query.defendantName) {
      sorts.push({
        id: 'defendantName',
        value: Array.isArray(query.defendantName) ? query.defendantName[0] : query.defendantName
      })
    }

    if (query.probationStatus) {
      sorts.push({
        id: 'probationStatus',
        value: Array.isArray(query.probationStatus) ? query.probationStatus[0] : query.probationStatus
      })
    }
  }

  const sortMapping = {
    NONE: 'none',
    ASC: 'ascending',
    DESC: 'descending'
  }
  const hearingDateSort = sortMapping[sorts.find(item => item.id === 'hearingDate')?.value] || ((query.defendantName || query.probationStatus) ? 'none' : 'ascending')
  const defendantSort = sortMapping[sorts.find(item => item.id === 'defendantName')?.value] || 'none'
  const probationStatusSort = sortMapping[sorts.find(item => item.id === 'probationStatus')?.value] || 'none'

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
    defendantSort,
    probationStatusSort,
    state,
    hearingOutcomesEnabled,
    pageSize: settings.hearingOutcomesPageSize,
    currentPage: parseInt(query.page || 1, 10),
    pagingBaseUrl
  }
  next()
}

module.exports = outcomesMiddleware
