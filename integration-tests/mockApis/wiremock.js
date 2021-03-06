const superagent = require('superagent')

const url = 'http://localhost:9091/__admin'
const stubFor = mapping => superagent.post(`${url}/mappings`).send(mapping)
const getRequests = () => superagent.get(`${url}/requests`)

module.exports = {
  stubFor,
  getRequests
}
