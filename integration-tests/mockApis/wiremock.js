const superagent = require('superagent')

const url = 'http://localhost:9091/__admin'
const stubFor = mapping => superagent.post(`${url}/mappings`).send(mapping)
const updateStubFor = (stubId, mapping) => superagent.put(`${url}/mappings/${stubId}`).send(mapping)
const getRequests = () => superagent.get(`${url}/requests`)

module.exports = {
  stubFor,
  updateStubFor,
  getRequests
}
