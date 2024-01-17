const path = require('path')
const process = require('process')

module.exports = (env) => ({
  stats: 'errors-only',
  entry: './public/config/external.js',
  plugins: [],
  output: {
    path: path.join(__dirname, '../build/javascripts'),
    filename: `external-${process.env.APP_VERSION}.min.js`
  },
  module: {
    rules: []
  }
})
