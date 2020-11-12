const moment = require('moment')

module.exports = () => {
  const tmpMoment = moment()
  return tmpMoment.day() === 0 ? tmpMoment.add(1, 'days').format('YYYY-MM-DD') : tmpMoment.format('YYYY-MM-DD')
}
