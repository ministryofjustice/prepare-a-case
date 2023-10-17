const path = require('path')

module.exports = (env) => {
  return {
    entry: './external.js',
    plugins: [],
    output: {
      path: path.join(__dirname, '/public/javascripts'),
      filename: `external-${env.app_version}.min.js`
    },
    module: {
      rules: []
    }
  }
}
