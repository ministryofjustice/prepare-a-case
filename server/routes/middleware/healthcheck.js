const axios = require('axios')
const config = require('../../../config')
const apiUrl = config.apis.courtCaseService.url

const health = async (req, res, next) => {
  function unhealthy () {
    res.render('error', { status: 500 }).end()
  }

  try {
    const response = await axios.get(`${apiUrl}/ping`)
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
