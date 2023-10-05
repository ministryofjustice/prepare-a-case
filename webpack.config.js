var path = require('path')

module.exports = {
  entry: './external.js',
  plugins: [],
  output: {
    path: path.join(__dirname, '/public/javascripts'),
    filename: 'external.min.js'
  },
  module: {
    rules: []
  }
}
