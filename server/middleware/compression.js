const compression = require('compression')

module.exports = async app => app.use(compression())