require('dotenv').config()

const production = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

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
  settings: {
    casesPerPage: get('CASES_PER_PAGE', 20),
    casesTotalDays: get('CASES_TOTAL_DAYS', 7),
    casesExcludedDays: get('CASES_EXCLUDED_DAYS', '0'), // Coma delimited String of days to exclude, incremental from 0 (Sunday)
    snapshotTimes: get('CASE_SNAPSHOT_TIMES', '00:00,08:45,09:45'), // Coma delimited string of snapshot times, earliest - latest
    availableCourts: [
      { code: 'B14AV', name: 'Barnsley Magistrates\' Court', shortName: 'Barnsley' },
      { code: 'B44BA', name: 'Basingstoke Magistrates\' Court', shortName: 'Basingstoke' },
      { code: 'B16BG', name: 'Beverley Magistrates\' Court', shortName: 'Beverley' },
      { code: 'B20BL', name: 'Birmingham Magistrates\' Court', shortName: 'Birmingham' },
      { code: 'B62DC', name: 'Cardiff Magistrates\' Court', shortName: 'Cardiff' },
      { code: 'B14ET', name: 'Doncaster Magistrates\' Court', shortName: 'Doncaster' },
      { code: 'B01GU', name: 'Highbury Corner Magistrates\' Court', shortName: 'Highbury Corner' },
      { code: 'B16HE', name: 'Hull Magistrates\' Court', shortName: 'Hull' },
      { code: 'B40IM', name: 'Luton and South Bedfordshire Magistrates\' Court', shortName: 'Luton and South Bedfordshire' },
      { code: 'B10BD', name: 'Mid and South East Northumberland Magistrates\' Court', shortName: 'Mid and South East Northumberland' },
      { code: 'B10JJ', name: 'Newcastle Magistrates\' Court', shortName: 'Newcastle' },
      { code: 'B10JQ', name: 'North Tyneside Magistrates\' Court', shortName: 'North Tyneside' },
      { code: 'B14LO', name: 'Sheffield Magistrates\' Court', shortName: 'Sheffield' }
    ]
  },
  session: {
    secret: get('SESSION_SECRET', 'prepare-a-case-insecure-default-session'),
    expiry: get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)
  },
  apis: {
    courtCaseService: {
      url: get('COURT_CASE_SERVICE_URL', 'http://localhost:9091', requiredInProduction)
    },
    oauth2: {
      url: get('NOMIS_AUTH_URL', 'http://localhost:9091/auth'),
      timeout: {
        response: get('AUTH_ENDPOINT_TIMEOUT_RESPONSE', 10000),
        deadline: get('AUTH_ENDPOINT_TIMEOUT_DEADLINE', 10000)
      },
      agent: {
        maxSockets: 100,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000
      },
      apiClientId: get('API_CLIENT_ID', 'prepare-a-case-for-court'),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret'),
      role: get('ROLE', 'ROLE_PREPARE_A_CASE')
    }
  },
  domain: `${get('INGRESS_URL', `http://localhost:${port}`)}`,
  https: production
}
