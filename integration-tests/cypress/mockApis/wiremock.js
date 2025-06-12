const superagent = require('superagent')

const url = 'http://localhost:9091/__admin'

async function stubPing() {
  return superagent.post(`${url}/mappings`)
    .send({
      request: {
        method: 'GET',
        url: '/ping'
      },
      response: {
        headers: {
        'Content-Type': 'text/html',
        },
        status: 200,
        body: 'pong from wiremock'
      }
    })
}

module.exports = { stubPing }
