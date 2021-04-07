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
      { code: 'B14AV', name: 'Barnsley Magistrates\' Court', shortName: 'Barnsley' },
      { code: 'B44BA', name: 'Basingstoke Magistrates\' Court', shortName: 'Basingstoke' },
      { code: 'B16BG', name: 'Beverley Magistrates\' Court', shortName: 'Beverley' },
      { code: 'B01BH', name: 'Bexley Magistrates\' Court', shortName: 'Bexley' },
      { code: 'B20BL', name: 'Birmingham Magistrates\' Court', shortName: 'Birmingham' },
      { code: 'B32UD', name: 'Boston Magistrates\' Court', shortName: 'Boston' },
      { code: 'B47CL', name: 'Brighton Magistrates\' Court', shortName: 'Brighton' },
      { code: 'B01CN', name: 'Bromley Magistrates\' Court', shortName: 'Bromley' },
      { code: 'B21DA', name: 'Cannock Magistrates\' Court', shortName: 'Cannock' },
      { code: 'B62DC', name: 'Cardiff Magistrates\' Court', shortName: 'Cardiff' },
      { code: 'B03DE', name: 'Carlisle Magistrates\' Court', shortName: 'Carlisle' },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court', shortName: 'North East Derbyshire and Dales (Chesterfield)' },
      { code: 'B20EB', name: 'Coventry Magistrates\' Court', shortName: 'Coventry' },
      { code: 'B01EF', name: 'Croydon Magistrates\' Court', shortName: 'Croydon' },
      { code: 'B14ET', name: 'Doncaster Magistrates\' Court', shortName: 'Doncaster' },
      { code: 'B20EY', name: 'Dudley Magistrates\' Court', shortName: 'Dudley' },
      { code: 'B16GB', name: 'Grimsby Magistrates\' Court and Family Court', shortName: 'Grimsby' },
      { code: 'B22GR', name: 'Hereford Justice Centre', shortName: 'Hereford' },
      { code: 'B01GU', name: 'Highbury Corner Magistrates\' Court', shortName: 'Highbury Corner' },
      { code: 'B16HE', name: 'Hull Magistrates\' Court', shortName: 'Hull' },
      { code: 'B37HI', name: 'Ipswich Magistrates\' Court', shortName: 'Ipswich' },
      { code: 'B22HM', name: 'Kidderminster Magistrates\' Court	Kidderminster' },
      { code: 'B23HS', name: 'Leamington Spa Magistrates\' Court', shortName: 'Leamington Spa' },
      { code: 'B13HT', name: 'Leeds Magistrates\' Court and Family Court', shortName: 'Leeds' },
      { code: 'B33HU', name: 'Leicester Magistrates\' Court', shortName: 'Leicester' },
      { code: 'B32HX', name: 'Lincoln Magistrates\' Court', shortName: 'Lincoln' },
      { code: 'B33II', name: 'Loughborough Magistrates\' Court', shortName: 'Loughborough' },
      { code: 'B40IM', name: 'Luton and South Bedfordshire Magistrates\' Court', shortName: 'Luton and South Bedfordshire' },
      { code: 'B31IT', name: 'Mansfield Magistrates\' and County Court', shortName: 'Mansfield' },
      { code: 'B10BD', name: 'Mid and South East Northumberland Magistrates\' Court', shortName: 'Mid and South East Northumberland' },
      { code: 'B10JJ', name: 'Newcastle Magistrates\' Court', shortName: 'Newcastle' },
      { code: 'B21JI', name: 'North Staffordshire Justice Centre', shortName: 'North Staffordshire' },
      { code: 'B10JQ', name: 'North Tyneside Magistrates\' Court', shortName: 'North Tyneside' },
      { code: 'B31JV', name: 'Nottingham Magistrates\' Court', shortName: 'Nottingham' },
      { code: 'B22KS', name: 'Redditch Magistrates\' Court', shortName: 'Redditch' },
      { code: 'B14LO', name: 'Sheffield Magistrates\' Court', shortName: 'Sheffield' },
      { code: 'B62MV', name: 'Swansea Magistrates\' Court', shortName: 'Swansea' },
      { code: 'B54MW', name: 'Swindon Magistrates\' Court', shortName: 'Swindon' },
      { code: 'B17JA', name: 'Teesside Magistrates\' Court', shortName: 'Teesside' },
      { code: 'B22MZ', name: 'Telford Magistrates\' Court', shortName: 'Telford' },
      { code: 'B01ND', name: 'Thames Magistrates\' Court', shortName: 'Thames' },
      { code: 'B20NP', name: 'Walsall Magistrates\' Court', shortName: 'Walsall' },
      { code: 'B01CE', name: 'Willesden Magistrates\' Court', shortName: 'Willesden' },
      { code: 'B20OQ', name: 'Wolverhampton Magistrates\' Court', shortName: 'Wolverhampton' },
      { code: 'B22OS', name: 'Worcester Justice Centre', shortName: 'Worcester' },
      { code: 'B47OV', name: 'Worthing Magistrates\' Court', shortName: 'Worthing' },
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
  googleAnalyticsKey: get('GOOGLE_ANALYTICS_KEY', null)
}
