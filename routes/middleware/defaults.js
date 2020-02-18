const moment = require('moment')

const defaults = (req, res, next) => {
  req.params.limit = process.env.CASES_PER_PAGE || 20
  req.params.moment = moment
  req.params.courtCode = 'SHF'
  req.params.courtName = 'Sheffield Magistrates\' Court'
  next()
}

module.exports = {
  defaults
}
