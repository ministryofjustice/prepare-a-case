require('dotenv').config()

const crypto = require('crypto')

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
      { code: 'B14AV', name: 'Barnsley Magistrates\' Court' },
      { code: 'B44BA', name: 'Basingstoke Magistrates\' Court' },
      { code: 'B16BG', name: 'Beverley Magistrates\' Court' },
      { code: 'B01BH', name: 'Bexley Magistrates\' Court' },
      { code: 'B20BL', name: 'Birmingham Magistrates\' Court' },
      { code: 'B32UD', name: 'Boston Magistrates\' Court' },
      { code: 'B47CL', name: 'Brighton Magistrates\' Court' },
      { code: 'B01CN', name: 'Bromley Magistrates\' Court' },
      { code: 'B21DA', name: 'Cannock Magistrates\' Court' },
      { code: 'B62DC', name: 'Cardiff Magistrates\' Court' },
      { code: 'B03DE', name: 'Carlisle Magistrates\' Court' },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court' },
      { code: 'B01DU', name: 'City of London Magistrates\' Court' },
      { code: 'B20EB', name: 'Coventry Magistrates\' Court' },
      { code: 'B01EF', name: 'Croydon Magistrates\' Court' },
      { code: 'B14ET', name: 'Doncaster Justice Centre (North & South)' },
      { code: 'B20EY', name: 'Dudley Magistrates\' Court' },
      { code: 'B16GB', name: 'Grimsby Magistrates\' Court and Family Court' },
      { code: 'B22GR', name: 'Hereford Justice Centre' },
      { code: 'B01GU', name: 'Highbury Corner Magistrates\' Court' },
      { code: 'B16HE', name: 'Hull Magistrates\' Court' },
      { code: 'B37HI', name: 'Ipswich Magistrates\' Court' },
      { code: 'B22HM', name: 'Kidderminster Magistrates\' Court' },
      { code: 'B23HS', name: 'Leamington Spa Magistrates\' Court' },
      { code: 'B13HT', name: 'Leeds Magistrates\' Court and Family Court' },
      { code: 'B33HU', name: 'Leicester Magistrates\' Court' },
      { code: 'B32HX', name: 'Lincoln Magistrates\' Court' },
      { code: 'B33II', name: 'Loughborough Magistrates\' Court' },
      { code: 'B40IM', name: 'Luton and South Bedfordshire Magistrates\' Court' },
      { code: 'B31IT', name: 'Mansfield Magistrates\' and County Court' },
      { code: 'B10BD', name: 'Mid and South East Northumberland Magistrates\' Court' },
      { code: 'B10JJ', name: 'Newcastle Magistrates\' Court' },
      { code: 'B21JI', name: 'North Staffordshire Justice Centre' },
      { code: 'B10JQ', name: 'North Tyneside Magistrates\' Court' },
      { code: 'B31JV', name: 'Nottingham Magistrates\' Court' },
      { code: 'B22KS', name: 'Redditch Magistrates\' Court' },
      { code: 'B14LO', name: 'Sheffield Magistrates\' Court' },
      { code: 'B62MV', name: 'Swansea Magistrates\' Court' },
      { code: 'B54MW', name: 'Swindon Magistrates\' Court' },
      { code: 'B17JA', name: 'Teesside Magistrates\' Court' },
      { code: 'B22MZ', name: 'Telford Magistrates\' Court' },
      { code: 'B01ND', name: 'Thames Magistrates\' Court' },
      { code: 'B20NQ', name: 'Walsall (Stafford Street) Magistrates\' Court' },
      { code: 'B20NP', name: 'Walsall (Aldridge) Magistrates\' Court' },
      { code: 'B23HS', name: 'Warwick Combined Court (Leamington Spa Magistrates\' Court)' },
      { code: 'B03OT', name: 'West Cumbria Magistrates\' Court' },
      { code: 'B01IX', name: 'Westminster Magistrates\' Court' },
      { code: 'B01CE', name: 'Willesden Magistrates\' Court' },
      { code: 'B20OQ', name: 'Wolverhampton Magistrates\' Court' },
      { code: 'B22OS', name: 'Worcester Justice Centre' },
      { code: 'B47OV', name: 'Worthing Magistrates\' Court' }
    ]
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false')
  },
  session: {
    secret: get('SESSION_SECRET', 'prepare-a-case-insecure-default-session', requiredInProduction),
    expiry: get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)
  },
  apis: {
    userPreferenceService: {
      url: get('USER_PREFERENCE_SERVICE_URL', 'http://localhost:9091', requiredInProduction)
    },
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
  https: production,
  nonce: crypto.randomBytes(16).toString('base64'),
  googleAnalyticsKey: get('GOOGLE_ANALYTICS_KEY', null),
  notification: ''
}
