const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')

const formatOut = bunyanFormat({ outputMode: 'json', color: true })

const log = bunyan.createLogger({ name: 'Prepare a Case', stream: formatOut, level: 'debug' })

module.exports = log
