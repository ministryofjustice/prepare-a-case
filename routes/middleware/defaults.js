const moment = require('moment')
require('moment-precise-range-plugin')

const defaults = (req, res, next) => {
  req.params.limit = process.env.CASES_PER_PAGE || 20
  req.params.moment = moment
  req.params.preciseDiff = moment.preciseDiff
  req.params.courtCode = 'SHF'
  req.params.courtName = 'Sheffield Magistrates\' Court'
  next()
}

module.exports = {
  defaults
}
