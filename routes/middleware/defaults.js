const moment = require('moment')

const defaults = (req, res, next) => {
  req.params.limit = process.env.CASES_PER_PAGE || 5
  req.params.moment = moment
  req.params.courtCode = 'SHF'
  req.params.courtName = 'Sheffield Magistrates\' Court'
  req.params.apiUrl = process.env.COURT_CASE_SERVICE_URL || 'http://127.0.0.1:9091'
  next()
}

module.exports = {
  defaults
}
