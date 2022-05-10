const axios = require('axios')
const { apis: { courtCaseService }, settings: { healthTimeout } } = require('../../../config')

const health = async (req, res, next) => {
  function unhealthy () {
    res.render('error', { status: 500 }).end()
  }

  try {
    const response = await axios.get(`${courtCaseService.url}/ping`, { timeout: healthTimeout })
    if (response && response.status < 400) {
      next()
    } else {
      unhealthy()
    }
  } catch (e) {
    unhealthy()
  }
}

module.exports = {
  health
}
