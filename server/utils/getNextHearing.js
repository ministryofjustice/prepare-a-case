const moment = require('moment')

const getNextHearing = (hearings, currentDateTime, sourceType) => {
  const morningSessionStart = moment(currentDateTime).hours(8).minute(59).seconds(59)

  const morningSessionEnd = moment(currentDateTime).hours(13).minutes(0).seconds(1)

  const afternoonSessionEnd = moment(currentDateTime).hours(17).minutes(0).seconds(0)

  let sessionTimeForComparison

  if (currentDateTime.isAfter(afternoonSessionEnd)) { // caters to users who use PAC after court hours
    sessionTimeForComparison = afternoonSessionEnd
  } else if (sourceType === 'LIBRA') {
    sessionTimeForComparison = morningSessionStart
  } else {
    sessionTimeForComparison = currentDateTime.isBefore(morningSessionEnd) ? morningSessionStart : morningSessionEnd
  }

  const sorted = hearings.sort((a, b) => moment(a.hearingDateTime).valueOf() - moment(b.hearingDateTime).valueOf())

  return sorted.find(hearing => moment(hearing.hearingDateTime).isAfter(sessionTimeForComparison))
}

module.exports = getNextHearing
