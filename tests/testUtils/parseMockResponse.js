const moment = require('moment')

function parseMockResponse ($json) {
  let jsonString = JSON.stringify($json)
  jsonString = jsonString.replace(/{{now format='yyyy-MM-dd'}}/g, moment().format('YYYY-MM-DD'))
    .replace(/{{now offset='5 months' format='yyyy-MM-dd'}}/g, moment().add(5, 'months').format('YYYY-MM-DD'))
    .replace(/{{now offset='6 months' format='yyyy-MM-dd'}}/g, moment().add(6, 'months').format('YYYY-MM-DD'))
    .replace(/{{now offset='12 months' format='yyyy-MM-dd'}}/g, moment().add(12, 'months').format('YYYY-MM-DD'))
    .replace(/{{now offset='-6 months' format='yyyy-MM-dd'}}/g, moment().add(-6, 'months').format('YYYY-MM-DD'))
    .replace(/{{now offset='-1 months' format='yyyy-MM-dd'}}/g, moment().add(-1, 'months').format('YYYY-MM-DD'))
    .replace(/{{now offset='-5 days' format='yyyy-MM-dd'}}/g, moment().add(-5, 'days').format('YYYY-MM-DD'))
  return JSON.parse(jsonString)
}

module.exports = {
  parseMockResponse
}
