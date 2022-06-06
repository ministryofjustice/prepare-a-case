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
    defaultTimeout: 4000,
    healthTimeout: 2000,
    casesPerPage: get('CASES_PER_PAGE', 20),
    casesTotalDays: get('CASES_TOTAL_DAYS', 7),
    casesExcludedDays: get('CASES_EXCLUDED_DAYS', '0'), // Coma delimited String of days to exclude, incremental from 0 (Sunday)
    snapshotTimes: get('CASE_SNAPSHOT_TIMES', '00:00,08:45,09:45'), // Coma delimited string of snapshot times, earliest - latest
    assetCache: '30d',
    scriptCache: '24h',
    availableCourts: [
      { code: 'B01KR', name: 'Barkingside Magistrates\' Court' },
      { code: 'B14AV', name: 'Barnsley Law Courts' },
      { code: 'B03AX', name: 'Barrow-in-Furness Magistrates\' Court' },
      { code: 'B44BA', name: 'Basingstoke Magistrates\' Court' },
      { code: 'B01BE', name: 'Belmarsh Magistrates\' Court' },
      { code: 'B10BF', name: 'Berwick upon Tweed Magistrates\' Court' },
      { code: 'B16BG', name: 'Beverley Magistrates\' Court' },
      { code: 'B01BH', name: 'Bexley Magistrates\' Court' },
      { code: 'B20BL', name: 'Birmingham Magistrates\' Court' },
      { code: 'B04BP', name: 'Blackburn Magistrates\' Court' },
      { code: 'B04BQ', name: 'Blackpool Magistrates\' and Civil Court' },
      { code: 'B06BV', name: 'Bolton Magistrates\' Court' },
      { code: 'B32BX', name: 'Boston Magistrates\' Court' },
      { code: 'B13CC', name: 'Bradford and Keighley Magistrates\' Court' },
      { code: 'B16CJ', name: 'Bridlington Magistrates\' Court' },
      { code: 'B47CL', name: 'Brighton Magistrates\' Court' },
      { code: 'B01CN', name: 'Bromley Magistrates\' Court' },
      { code: 'B04CO', name: 'Burnley Magistrates\' Court' },
      { code: 'B21DA', name: 'Cannock Magistrates\' Court' },
      { code: 'B46DB', name: 'Canterbury Magistrates\' Court' },
      { code: 'B62DC', name: 'Cardiff Magistrates\' Court' },
      { code: 'B03DE', name: 'Carlisle Magistrates\' Court' },
      { code: 'B07DM', name: 'Chester Magistrates\' Court' },
      { code: 'B01DU', name: 'City of London Magistrates\' Court' },
      { code: 'B20EB', name: 'Coventry Magistrates\' Court' },
      { code: 'B07ED', name: 'Crewe (South Cheshire) Magistrates\' Court' },
      { code: 'B01EF', name: 'Croydon Magistrates\' Court' },
      { code: 'B11EI', name: 'Darlington Magistrates\' Court' },
      { code: 'B30PI', name: 'Derby Magistrates\' Court' },
      { code: 'B14ET', name: 'Doncaster Justice Centre North' },
      { code: 'B20EY', name: 'Dudley Magistrates\' Court' },
      { code: 'B01FA', name: 'Ealing Magistrates\' Court' },
      { code: 'B46FO', name: 'Folkestone Magistrates\' Court' },
      { code: 'B10FR', name: 'Gateshead Magistrates\' Court' },
      { code: 'B16GB', name: 'Grimsby Magistrates\' Court' },
      { code: 'B12GH', name: 'Harrogate Justice Centre' },
      { code: 'B01GQ', name: 'Hendon Magistrates\' Court' },
      { code: 'B22GR', name: 'Hereford Justice Centre' },
      { code: 'B01GU', name: 'Highbury Corner Magistrates\' Court' },
      { code: 'B16HE', name: 'Hull and Holderness Magistrates\' Court' },
      { code: 'B22HM', name: 'Kidderminster Magistrates\' Court' },
      { code: 'B13HD', name: 'Kirklees (Huddersfield) Magistrates\' Court' },
      { code: 'B04HQ', name: 'Lancaster Courthouse' },
      { code: 'B01LY', name: 'Lavender Hill Magistrates\' Court' },
      { code: 'B23HS', name: 'Leamington Spa Magistrates\' Court' },
      { code: 'B13HT', name: 'Leeds Magistrates\' Court' },
      { code: 'B33HU', name: 'Leicester Magistrates\' Court' },
      { code: 'B32HX', name: 'Lincoln Magistrates\' Court' },
      { code: 'B05PK', name: 'Liverpool & Knowsley Magistrates\' Court' },
      { code: 'B33II', name: 'Loughborough Magistrates\' Court' },
      { code: 'B40IM', name: 'Luton and South Bedfordshire Magistrates\' Court' },
      { code: 'B46IR', name: 'Maidstone Magistrates\' Court' },
      { code: 'B06IS', name: 'Manchester Magistrates\' Court' },
      { code: 'B31IT', name: 'Mansfield Magistrates\' and County Court' },
      { code: 'B46IU', name: 'Margate Magistrates\' Court' },
      { code: 'B46DH', name: 'Medway Magistrates\' Court' },
      { code: 'B10BD', name: 'Mid and South East Northumberland Law Courts' },
      { code: 'B10JL', name: 'Newcastle Magistrates\' Court' },
      { code: 'B11JP', name: 'Newton Aycliffe Magistrates\' Court' },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court' },
      { code: 'B21JI', name: 'North Staffordshire Justice Centre' },
      { code: 'B10JQ', name: 'North Tyneside Magistrates\' Court' },
      { code: 'B34JS', name: 'Northampton Magistrates\' Court' },
      { code: 'B31JV', name: 'Nottingham Magistrates\' Court' },
      { code: 'B23PP', name: 'Nuneaton Magistrates\' Court' },
      { code: 'B11KF', name: 'Peterlee Magistrates\' Court' },
      { code: 'B04KO', name: 'Preston Magistrates\' Court' },
      { code: 'B22KS', name: 'Redditch Magistrates\' Court' },
      { code: 'B01LA', name: 'Romford Magistrates\' Court' },
      { code: 'B12LK', name: 'Scarborough Justice Centre' },
      { code: 'B05BW', name: 'Sefton Magistrates\' Court' },
      { code: 'B46LN', name: 'Sevenoaks Magistrates\' Court' },
      { code: 'B14LO', name: 'Sheffield Magistrates\' Court' },
      { code: 'B12LT', name: 'Skipton Magistrates\' Court' },
      { code: 'B10LX', name: 'South Tyneside Magistrates\' Court' },
      { code: 'B22OS', name: 'South Worcestershire Magistrates\' Court' },
      { code: 'B06MK', name: 'Stockport Magistrates\' Court' },
      { code: 'B01MN', name: 'Stratford Magistrates\' Court' },
      { code: 'B10MR', name: 'Sunderland Magistrates\' Court' },
      { code: 'B62MV', name: 'Swansea Magistrates\' Court' },
      { code: 'B54MW', name: 'Swindon Magistrates\' Court' },
      { code: 'B06AN', name: 'Tameside Magistrates\' Court' },
      { code: 'B17JA', name: 'Teesside Magistrates\' Court' },
      { code: 'B22MZ', name: 'Telford Magistrates\' Court' },
      { code: 'B01ND', name: 'Thames Magistrates\' Court' },
      { code: 'B01NM', name: 'Uxbridge Magistrates\' Court' },
      { code: 'B20NQ', name: 'Walsall Magistrates\' Court' },
      { code: 'B07FQ', name: 'Warrington Magistrates\' Court' },
      { code: 'B23HS', name: 'Warwick Combined Court' },
      { code: 'B34NX', name: 'Wellingborough Magistrates\' Court' },
      { code: 'B03OT', name: 'West Cumbria Courthouse' },
      { code: 'B01IX', name: 'Westminster Magistrates\' Court' },
      { code: 'B06OJ', name: 'Wigan and Leigh Magistrates\' Court' },
      { code: 'B01CE', name: 'Willesden Magistrates\' Court' },
      { code: 'B01OK', name: 'Wimbledon Magistrates\' Court' },
      { code: 'B05BK', name: 'Wirral Magistrates\' Court' },
      { code: 'B20OQ', name: 'Wolverhampton Magistrates\' Court' },
      { code: 'Worcester', name: 'Justice Centre' },
      { code: 'B12PA', name: 'York Magistrates\' Court' }
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
    expiry: get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120),
    cookieOptions: { maxAge: 365 * 24 * 60 * 60 * 1000 }
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
  appVersion: get('APP_VERSION', 'dev-build'),
  domain: `${get('INGRESS_URL', `http://localhost:${port}`)}`,
  https: production,
  nonce: crypto.randomBytes(16).toString('base64'),
  googleAnalyticsKey: get('GOOGLE_ANALYTICS_KEY', null),
  notification: {
    username: get('NOTIFICATION_USERNAME', null, requiredInProduction),
    password: get('NOTIFICATION_PASSWORD', null, requiredInProduction)
  },
  features: {
    sendPncAndCroWithOffenderUpdates: false
  }
}
