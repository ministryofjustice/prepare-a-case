const moment = require('moment')

function parseMockResponse ($json) {
  let stringiFied = JSON.stringify($json)
  stringiFied = stringiFied.replace('{{now format=\'yyyy-MM-dd\'}}', moment().format('YYYY-MM-DD'))
  stringiFied = stringiFied.replace('{{now offset=\'5 months\' format=\'yyyy-MM-dd\'}}', moment().add(5, 'months').format('YYYY-MM-DD'))
  stringiFied = stringiFied.replace('{{now offset=\'6 months\' format=\'yyyy-MM-dd\'}}', moment().add(6, 'months').format('YYYY-MM-DD'))
  stringiFied = stringiFied.replace('{{now offset=\'-6 months\' format=\'yyyy-MM-dd\'}}', moment().add(-6, 'months').format('YYYY-MM-DD'))
  stringiFied = stringiFied.replace('{{now offset=\'-1 months\' format=\'yyyy-MM-dd\'}}', moment().add(-1, 'months').format('YYYY-MM-DD'))
  stringiFied = stringiFied.replace('{{now offset=\'-5 days\' format=\'yyyy-MM-dd\'}}', moment().add(-5, 'days').format('YYYY-MM-DD'))
  return JSON.parse(stringiFied)
}

module.exports = {
  parseMockResponse
}
