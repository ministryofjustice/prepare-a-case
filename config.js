require('dotenv').config()

const production = process.env.NODE_ENV === 'production'

function get (name, fallback, options = {}) {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

module.exports = {
  session: {
    secret: get('SESSION_SECRET', 'prepare-a-case-insecure-default-session'),
    expiry: get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)
  },
  apis: {
    courtCaseService: {
      url: get('COURT_CASE_SERVICE_URL', 'http://127.0.0.1:9091', requiredInProduction)
    },
    oauth2: {
      url: get('NOMIS_AUTH_URL', 'http://localhost:9090/auth'),
      externalUrl: get('', get('NOMIS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: get('AUTH_ENDPOINT_TIMEOUT_RESPONSE', 10000),
        deadline: get('AUTH_ENDPOINT_TIMEOUT_DEADLINE', 10000)
      },
      agent: {
        maxSockets: 100,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000
      },
      service: {
        url: get('SERVICE_ENDPOINT_URL', 'http://localhost:8080', requiredInProduction),
        timeout: {
          response: get('SERVICE_ENDPOINT_TIMEOUT_RESPONSE', 10000),
          deadline: get('SERVICE_ENDPOINT_TIMEOUT_DEADLINE', 10000)
        }
      },
      apiClientId: get('API_CLIENT_ID', 'prepare-a-case-for-court'),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret'),
      role: get('ROLE', 'ROLE_PREPARE_A_CASE')
    }
  },
  domain: `${get('INGRESS_URL', 'http://localhost:3000')}`,
  links: {
    exitUrl: get('EXIT_LOCATION_URL', '/', requiredInProduction)
  },
  https: production
}
