const nunjucksSetup = require('./utils/nunjucksSetup')
const path = require('path')

module.exports = async app => {

  nunjucksSetup(app, path)
  app.set('view engine', 'njk')
}