const path = require('path')
const process = require('process')

module.exports = (env) => ({
  stats: 'errors-only',
  entry: './public/config/external.js',
  plugins: [],
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  output: {
    path: path.join(__dirname, '../build/javascripts'),
    filename: `external-${process.env.APP_VERSION}.min.js`
  },
  watch: process.env.NODE_ENV === 'development',
  watchOptions: {
    poll: 500,
    ignored: ['./node_modules']
  },
  module: {
    rules: []
  }
})
