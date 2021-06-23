const superagent = require('superagent')
const Agent = require('agentkeepalive')
const { HttpsAgent } = require('agentkeepalive')
const logger = require('../../log')
const config = require('../../config')

const timeoutSpec = {
  response: config.apis.oauth2.timeout.response,
  deadline: config.apis.oauth2.timeout.deadline
}
const apiUrl = config.apis.oauth2.url

const agentOptions = {
  maxSockets: config.apis.oauth2.agent.maxSockets,
  maxFreeSockets: config.apis.oauth2.agent.maxFreeSockets,
  freeSocketTimeout: config.apis.oauth2.agent.freeSocketTimeout
}

const keepaliveAgent = apiUrl.startsWith('https') ? new HttpsAgent(agentOptions) : new Agent(agentOptions)

module.exports = token => {
  const userGet = userGetBuilder(token)

  return {
    async getEmail (username) {
      const path = `${apiUrl}/api/user/${username}/email`
      const { status, body } = await userGet({ path, raw: true })
      return { ...body, username, exists: status !== 404, verified: status === 200 }
    },
    async getUser () {
      const path = `${apiUrl}/api/user/me`
      const { status, body } = await userGet({ path, raw: true })
      return { ...body, displayName: body.name, exists: status !== 404, verified: status === 200 }
    }
  }
}

function userGetBuilder (token) {
  return async ({ path = null, query = '', headers = {}, responseType = '', raw = false } = {}) => {
    logger.info(`Get using user credentials: calling oauth: ${path} ${query}`)
    try {
      const result = await superagent
        .get(path)
        .ok(res => res.status < 500)
        .agent(keepaliveAgent)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(timeoutSpec)

      return raw ? result : result.body
    } catch (error) {
      logger.warn(error, 'Error calling oauth')
      throw error
    }
  }
}
