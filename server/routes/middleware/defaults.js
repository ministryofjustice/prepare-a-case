const moment = require('moment')
const { settings } = require('../../../config')

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
  const Sunday = 0
  const Saturday = 6
  let daysRemaining = daysToAdd
  while (isMinus ? daysRemaining < 0 : daysRemaining > 0) {
    newDate.add(isMinus ? -1 : 1, 'days')
    if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
      isMinus ? daysRemaining++ : daysRemaining--
    }
  }
  return newDate
}

function courtLookup (courtCode) {
  const courtData = {}
  switch (courtCode) {
    case 'SHF':
      courtData.code = courtCode
      courtData.name = 'Sheffield Magistrates\' Court'
      courtData.rooms = 10
      break;
    case 'B10JQ00':
      courtData.code = courtCode
      courtData.name = 'North Tyneside Magistrates\' Court'
      courtData.rooms = 6
      break
    default:
      courtData.code = courtCode
      courtData.name = ''
      courtData.rooms = 0
  }
  return courtData
}

const defaults = (req, res, next) => {

  const courtData = courtLookup(req.cookies.court)

  req.params = {
    ...req.params,
    limit: settings.casesPerPage,
    moment: moment,
    getMonthsAndDays: getMonthsAndDays,
    addBusinessDays: addBusinessDays,
    getPath: getPath,
    courtCode: courtData.code,
    courtName: courtData.name,
    courtRooms: courtData.rooms
  }
  next()
}

module.exports = {
  defaults,
  getPath,
  getMonthsAndDays,
  addBusinessDays
}
