const axios = require('axios')
const courtCaseService = 'http://court-case-service-dev.apps.live-1.cloud-platform.service.justice.gov.uk'

const health = async (req, res, next) => {
  try {
    const response = await axios.get(courtCaseService + '/ping')
    req.healthy = response && response.status === 200
    next()
  } catch (e) {
    req.healthy = false
    next()
  }
}

module.exports = {
  courtCaseService,
  health
}
