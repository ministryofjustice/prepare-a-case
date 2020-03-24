const moment = require('moment')

// Method to allow Nunjucks groupby filter to group by nested Object value
function getPath (path) {
  const parts = path.split('.')
  return value => {
    let o = value
    for (const p of parts) {
      o = o[p]
    }
    return o
  }
}

// Method to calculate the difference between two moment dates and return duration in months and days
function getMonthsAndDays (startTime, endTime) {
  return ['months', 'days'].map(interval => {
    const diff = endTime.diff(startTime, interval)
    startTime.add(diff, interval)
    return diff + ' ' + (diff === 1 ? interval.substring(0, interval.length - 1) : interval)
  }).join(', ')
}

const defaults = (req, res, next) => {
  req.params.limit = process.env.CASES_PER_PAGE || 20
  req.params.moment = moment
  req.params.getMonthsAndDays = getMonthsAndDays
  req.params.getPath = getPath
  req.params.courtCode = 'SHF'
  req.params.courtName = 'Sheffield Magistrates\' Court'
  next()
}

module.exports = {
  defaults,
  getPath,
  getMonthsAndDays
}
