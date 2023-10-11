const getOutcomeListSorts = require('../../utils/getOutcomesSorts')
const features = require('../../utils/features')
const log = require('../../../log')
const outcomesMiddleware = state => async (req, res, next) => {
  const context = { court: req.params.courtCode, username: res.locals.user.username }

  const hearingOutcomesEnabled = features.hearingOutcomes.isEnabled(context)

  if (!hearingOutcomesEnabled) { // prevents anyone using the direct link
    log.warn('Hearing outcomes not enabled', context)
    res.sendStatus(400)
    return
  }

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
    hearingDateSort,
    state
  }
  next()
}

module.exports = outcomesMiddleware
