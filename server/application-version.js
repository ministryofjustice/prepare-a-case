// eslint-disable import/no-unresolved,global-require
const fs = require('fs')

const packageData = JSON.parse(fs.readFileSync('./package.json').toString())
const buildNumber = fs.existsSync('./build-info.json')
  ? JSON.parse(fs.readFileSync('./build-info.json').toString()).buildNumber
  : packageData.version
module.exports = { buildNumber, packageData }
