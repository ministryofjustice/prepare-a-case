const { instance: axios } = require('./authorisationMiddleware')
const { apis: { courtCaseService }, settings: { healthTimeout } } = require('../../config')

const health = async (req, res, next) => {
  function unhealthy () {
    res.render('error', { status: 500 })
  }

  try {
    const response = await axios.get(`${courtCaseService.url}/ping`, { timeout: healthTimeout })
    if (response && response.status < 400) {
      next()
    } else {
      unhealthy()
    }
  } catch (e) {
    // TODO: WARN: errors other than http response get swallowed here!
    unhealthy()
  }
}

module.exports = {
  health
}
