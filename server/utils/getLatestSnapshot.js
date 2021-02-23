const moment = require('moment')
const config = require('../../config')

/**
 * @typedef {import('moment')} moment
 */
/**
 * Get the latest snapshot date and time
 * @param {string} caseListDate - Date string as 'YYYY-MM-DD'
 * @returns {moment}
 */
module.exports = caseListDate => {
  const now = moment()
  const requestedDate = moment(caseListDate)
  const snapshotTimes = config.settings.snapshotTimes.split(',')

  if (requestedDate.isBefore(now, 'day')) {
    return moment(`${requestedDate.format('YYYY-MM-DD')} ${snapshotTimes.pop()}`)
  }

  let currentTestTime, latestSnapshot

  snapshotTimes.forEach(snapshotTime => {
    currentTestTime = moment(`${now.format('YYYY-MM-DD')} ${snapshotTime}`)
    if (now.isSameOrAfter(currentTestTime, 'minute')) {
      latestSnapshot = currentTestTime
    }
  })

  return latestSnapshot || moment(`${now.format('YYYY-MM-DD')} ${snapshotTimes.shift()}`)
}
