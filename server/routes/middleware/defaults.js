const moment = require('moment')
const { settings, nonce } = require('../../../config')

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
    return diff ? `${diff} ${(diff === 1 ? interval.substring(0, interval.length - 1) : interval)}` : null
  }).filter(item => !!item).join(', ')
}

// Method to add/remove days to moment date excluding weekends
function addBusinessDays (originalDate, daysToAdd) {
  const isMinus = daysToAdd < 0
  const newDate = originalDate.clone()
  let daysRemaining = daysToAdd
  while (isMinus ? daysRemaining < 0 : daysRemaining > 0) {
    newDate.add(isMinus ? -1 : 1, 'days')
    if (!settings.casesExcludedDays.split(',').includes(newDate.day().toString())) {
      isMinus ? daysRemaining++ : daysRemaining--
    }
  }
  return newDate
}

function courtLookup (courtCode) {
  const courtLookup = settings.availableCourts.find(court => court.code === courtCode)
  return {
    name: (courtLookup && courtLookup.name) || ''
  }
}

const defaults = (req, res, next) => {
  const courtData = courtLookup(req.params.courtCode)
  req.params = {
    ...req.params,
    analyticsCookies: req.cookies && req.cookies.analyticsCookies,
    limit: settings.casesPerPage,
    moment: moment,
    getMonthsAndDays: getMonthsAndDays,
    addBusinessDays: addBusinessDays,
    getPath: getPath,
    courtName: courtData.name,
    nonce: nonce
  }
  next()
}

module.exports = {
  defaults,
  getPath,
  getMonthsAndDays,
  addBusinessDays
}
