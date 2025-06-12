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

const getBooleanParam = (name, options = {}) => get(name, 'false').toLowerCase() === 'true'

const requiredInProduction = { requireInProduction: true }

const getCsvParamAsArray = param => get(param, '')?.split(',').map(value => value.trim())

module.exports = {
  settings: {
    defaultTimeout: get('DEFAULT_TIMEOUT', 20000),
    healthTimeout: 2000,
    reduceStdoutNoise: get('REDUCE_STDOUT_NOISE', false),
    casesPerPage: get('CASES_PER_PAGE', 20),
    casesTotalDays: get('CASES_TOTAL_DAYS', 28),
    casesPastDays: get('CASES_PAST_DAYS', 14),
    caseTrackingPrePilotUsers: getCsvParamAsArray('CASE_TRACKING_PRE_PILOT_USERS'),
    liverpoolPrePilotUsers: getCsvParamAsArray('LIVERPOOL_PRE_PILOT_USERS'),
    caseSearchUsers: getCsvParamAsArray('CASE_SEARCH_USERS'),
    pacEnvironment: get('PAC_ENV', 'UNKNOWN'),
    enablePastCasesNavigation: getBooleanParam('ENABLE_PAST_CASES_NAVIGATION'),
    enableHearingOutcomes: getBooleanParam('ENABLE_HEARING_OUTCOMES'),
    enableMoveToResultedAction: getBooleanParam('ENABLE_MOVE_TO_RESULTED_ACTION'),
    enableWorkflow: getBooleanParam('ENABLE_WORKFLOW'),
    casesExcludedDays: get('CASES_EXCLUDED_DAYS', '-1'), // Coma delimited String of days to exclude, incremental from 0 (Sunday) - fallback to -1 to exclude no days
    snapshotTimes: get('CASE_SNAPSHOT_TIMES', '00:00,08:45,09:45'), // Coma delimited string of snapshot times, earliest - latest
    assetCache: '30d',
    scriptCache: '24h',
    matchingRecordsToBeShownPerPage: 5,
    maximumPages: 4,
    caseSearchResultPageSize: get('CASE_SEARCH_PAGE_SIZE', 20),
    hearingOutcomesPageSize: get('HEARING_OUTCOMES_PAGE_SIZE', 20),
    enableMatcherLogging: getBooleanParam('ENABLE_MATCHER_LOGGING'),
    availableCourts: [
      { code: 'B63AD', name: 'Aberystwyth Magistrates Court' },
      { code: 'B44AG', name: 'Aldershot Magistrates\' Court' },
      { code: 'B52BB', name: 'Bath Law Courts' },
      { code: 'B01KR', name: 'Barkingside Magistrates\' Court' },
      { code: 'B14AV', name: 'Barnsley Law Courts' },
      { code: 'B50AW', name: 'Barnstaple Magistrates\' Court' },
      { code: 'B03AX', name: 'Barrow-in-Furness Magistrates\' Court' },
      { code: 'B42AZ', name: 'Basildon Magistrates\' Court and Family Court' },
      { code: 'B44BA', name: 'Basingstoke Magistrates\' Court' },
      { code: 'B01BE', name: 'Belmarsh Magistrates\' Court' },
      { code: 'B10BF', name: 'Berwick upon Tweed Magistrates\' Court' },
      { code: 'B16BG', name: 'Beverley Magistrates\' Court' },
      { code: 'B01BH', name: 'Bexley Magistrates\' Court' },
      { code: 'B20BL', name: 'Birmingham Magistrates\' Court' },
      { code: 'B04BP', name: 'Blackburn Magistrates\' Court' },
      { code: 'B04BQ', name: 'Blackpool Magistrates\' and Civil Court' },
      { code: 'B50BU', name: 'Bodmin Magistrates\' Court' },
      { code: 'B06BV', name: 'Bolton Magistrates\' Court' },
      { code: 'B32BX', name: 'Boston Magistrates\' Court' },
      { code: 'B13CC', name: 'Bradford and Keighley Magistrates\' Court' },
      { code: 'B16CJ', name: 'Bridlington Magistrates\' Court' },
      { code: 'B47CL', name: 'Brighton Magistrates\' Court' },
      { code: 'B52CM', name: 'Bristol Magistrates\' Court' },
      { code: 'B01CN', name: 'Bromley Magistrates\' Court' },
      { code: 'B04CO', name: 'Burnley Magistrates\' Court' },
      { code: 'B60WU', name: 'Caernarfon Justice Centre' },
      { code: 'B35CZ', name: 'Cambridge Magistrates\' Court' },
      { code: 'B21DA', name: 'Cannock Magistrates\' Court' },
      { code: 'B46DB', name: 'Canterbury Magistrates\' Court' },
      { code: 'B62DC', name: 'Cardiff Magistrates\' Court' },
      { code: 'B03DE', name: 'Carlisle Magistrates\' Court' },
      { code: 'B42CM', name: 'Chelmsford Magistrates\' Court and Family Court' },
      { code: 'B53DJ', name: 'Cheltenham Magistrates\' Court' },
      { code: 'B07DM', name: 'Chester Magistrates\' Court' },
      { code: 'B53DT', name: 'Cirencester Magistrates\' Court' },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court' },
      { code: 'B01DU', name: 'City of London Magistrates\' Court' },
      { code: 'B42CO', name: 'Colchester Magistrates\' Court and Family Court' },
      { code: 'B20EB', name: 'Coventry Magistrates\' Court' },
      { code: 'B47EC', name: 'Crawley Magistrates\' Court' },
      { code: 'B07ED', name: 'Crewe (South Cheshire) Magistrates\' Court' },
      { code: 'B01EF', name: 'Croydon Magistrates\' Court' },
      { code: 'B61EH', name: 'Cwmbran Magistrates\' Court' },
      { code: 'B11EI', name: 'Darlington Magistrates\' Court' },
      { code: 'B30PI', name: 'Derby Magistrates\' Court' },
      { code: 'B14ET', name: 'Doncaster Justice Centre North' },
      { code: 'B20EY', name: 'Dudley Magistrates\' Court' },
      { code: 'B01FA', name: 'Ealing Magistrates\' Court' },
      { code: 'B43LV', name: 'East Berkshire Magistrates\' Court, Slough' },
      { code: 'B50VR', name: 'Exeter Magistrates\' Court - North and East Devon' },
      { code: 'B46FO', name: 'Folkestone Magistrates\' Court' },
      { code: 'B10FR', name: 'Gateshead Magistrates\' Court' },
      { code: 'B36FZ', name: 'Great Yarmouth Magistrates\' Court' },
      { code: 'B16GB', name: 'Grimsby Magistrates\' Court' },
      { code: 'B45GC', name: 'Guildford Magistrates\' Court' },
      { code: 'B47GL', name: 'Hastings Magistrates\' Court' },
      { code: 'B41US', name: 'Hatfield Magistrates\' Court' },
      { code: 'B12GH', name: 'Harrogate Justice Centre' },
      { code: 'B63GN', name: 'Haverfordwest Magistrates\' Court' },
      { code: 'B01GQ', name: 'Hendon Magistrates\' Court' },
      { code: 'B22GR', name: 'Hereford Justice Centre' },
      { code: 'B43OX', name: 'High Wycombe Magistrates\' Court' },
      { code: 'B01GU', name: 'Highbury Corner Magistrates\' Court' },
      { code: 'B47HB', name: 'Horsham Magistrates\' Court' },
      { code: 'B16HE', name: 'Hull and Holderness Magistrates\' Court' },
      { code: 'B35HF', name: 'Huntingdon Law Courts' },
      { code: 'B37HI', name: 'Ipswich Magistrates\' Court' },
      { code: 'B44JK', name: 'Isle of Wight Magistrates\' Court' },
      { code: 'B22HM', name: 'Kidderminster Magistrates\' Court' },
      { code: 'B36HN', name: 'King\'s Lynn Magistrates\' Court' },
      { code: 'B13HD', name: 'Kirklees (Huddersfield) Magistrates\' Court' },
      { code: 'B04HQ', name: 'Lancaster Courthouse' },
      { code: 'B01LY', name: 'Lavender Hill Magistrates\' Court' },
      { code: 'B23HS', name: 'Leamington Spa Magistrates\' Court' },
      { code: 'B13HT', name: 'Leeds Magistrates\' Court' },
      { code: 'B33HU', name: 'Leicester Magistrates\' Court' },
      { code: 'B32HX', name: 'Lincoln Magistrates\' Court' },
      { code: 'B05PK', name: 'Liverpool & Knowsley Magistrates\' Court' },
      { code: 'B63IC', name: 'Llandrindod Wells Magistrates\'' },
      { code: 'B60ID', name: 'Llandudno Magistrates\' Court' },
      { code: 'B63IE', name: 'Llanelli Law Courts' },
      { code: 'B33II', name: 'Loughborough Magistrates\' Court' },
      { code: 'B40IM', name: 'Luton and South Bedfordshire Magistrates\' Court' },
      { code: 'B46IR', name: 'Maidstone Magistrates\' Court' },
      { code: 'B06IS', name: 'Manchester Magistrates\' Court' },
      { code: 'B31IT', name: 'Mansfield Magistrates\' and County Court' },
      { code: 'B46IU', name: 'Margate Magistrates\' Court' },
      { code: 'B46DH', name: 'Medway Magistrates\' Court' },
      { code: 'B62IZ', name: 'Merthyr Tydfil Combined Court Centre' },
      { code: 'B10BD', name: 'Mid and South East Northumberland Law Courts' },
      { code: 'B43JC', name: 'Milton Keynes Magistrates\' Court' },
      { code: 'B60JE', name: 'Mold Justice Centre' },
      { code: 'B10JL', name: 'Newcastle Magistrates\' Court' },
      { code: 'B61NP', name: 'Newport (South Wales) Magistrates\' Court' },
      { code: 'B50JO', name: 'Newton Abbot Magistrates\' Court' },
      { code: 'B11JP', name: 'Newton Aycliffe Magistrates\' Court' },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court' },
      { code: 'B52OC', name: 'North Somerset Magistrates\' Court' },
      { code: 'B21JI', name: 'North Staffordshire Justice Centre' },
      { code: 'B10JQ', name: 'North Tyneside Magistrates\' Court' },
      { code: 'B34JS', name: 'Northampton Magistrates\' Court' },
      { code: 'B36JU', name: 'Norwich Magistrates\' Court' },
      { code: 'B31JV', name: 'Nottingham Magistrates\' Court' },
      { code: 'B23PP', name: 'Nuneaton Magistrates\' Court' },
      { code: 'B43KB', name: 'Oxford and Southern Oxfordshire Magistrates\' Court' },
      { code: 'B35KE', name: 'Peterborough Magistrates\' Court' },
      { code: 'B11KF', name: 'Peterlee Magistrates\' Court' },
      { code: 'B50KH', name: 'Plymouth Magistrates\' Court' },
      { code: 'B55KL', name: 'Poole Magistrates\' Court' },
      { code: 'B62KL', name: 'Port Talbot Justice Centre' },
      { code: 'B44KM', name: 'Portsmouth Magistrates\' Court' },
      { code: 'B04KO', name: 'Preston Magistrates\' Court' },
      { code: 'B43KQ', name: 'Reading Magistrates\' Court' },
      { code: 'B22KS', name: 'Redditch Magistrates\' Court' },
      { code: 'B01LA', name: 'Romford Magistrates\' Court' },
      { code: 'B54WV', name: 'Salisbury Law Courts' },
      { code: 'B12LK', name: 'Scarborough Justice Centre' },
      { code: 'B05BW', name: 'Sefton Magistrates\' Court' },
      { code: 'B46LN', name: 'Sevenoaks Magistrates\' Court' },
      { code: 'B42MB', name: 'Southend Magistrates\' Court' },
      { code: 'B14LO', name: 'Sheffield Magistrates\' Court' },
      { code: 'B12LT', name: 'Skipton Magistrates\' Court' },
      { code: 'B10LX', name: 'South Tyneside Magistrates\' Court' },
      { code: 'B22OS', name: 'South Worcestershire Magistrates\' Court' },
      { code: 'B42MB', name: 'Southend Magistrates\' Court' },
      { code: 'B41ME', name: 'St Albans Magistrates\' Court' },
      { code: 'B45MH', name: 'Staines Magistrates\' Court' },
      { code: 'B41MJ', name: 'Stevenage Magistrates\' Court' },
      { code: 'B06MK', name: 'Stockport Magistrates\' Court' },
      { code: 'B01MN', name: 'Stratford Magistrates\' Court' },
      { code: 'B10MR', name: 'Sunderland Magistrates\' Court' },
      { code: 'B62MV', name: 'Swansea Magistrates\' Court' },
      { code: 'B54MW', name: 'Swindon Magistrates\' Court' },
      { code: 'B06AN', name: 'Tameside Magistrates\' Court' },
      { code: 'B52MY', name: 'Taunton Magistrates\' Court' },
      { code: 'B17JA', name: 'Teesside Magistrates\' Court' },
      { code: 'B22MZ', name: 'Telford Magistrates\' Court' },
      { code: 'B01ND', name: 'Thames Magistrates\' Court' },
      { code: 'B50NL', name: 'Truro Magistrates\' Court' },
      { code: 'B01NM', name: 'Uxbridge Magistrates\' Court' },
      { code: 'B20NQ', name: 'Walsall Magistrates\' Court' },
      { code: 'B07FQ', name: 'Warrington Magistrates\' Court' },
      { code: 'B23HS', name: 'Warwick Combined Court' },
      { code: 'B34NX', name: 'Wellingborough Magistrates\' Court' },
      { code: 'B63NZ', name: 'Welshpool Magistrates\' Court' },
      { code: 'B03OT', name: 'West Cumbria Courthouse' },
      { code: 'B44MA', name: 'West Hampshire Magistrates\' Court' },
      { code: 'B01IX', name: 'Westminster Magistrates\' Court' },
      { code: 'B55OE', name: 'Weymouth Combined Court' },
      { code: 'B06OJ', name: 'Wigan and Leigh Magistrates\' Court' },
      { code: 'B01CE', name: 'Willesden Magistrates\' Court' },
      { code: 'B01OK', name: 'Wimbledon Magistrates\' Court' },
      { code: 'B05BK', name: 'Wirral Magistrates\' Court' },
      { code: 'B20OQ', name: 'Wolverhampton Magistrates\' Court' },
      { code: 'B22OS', name: 'Worcester Justice Centre' },
      { code: 'B47OV', name: 'Worthing Magistrates\' Court' },
      { code: 'B60OW', name: 'Wrexham Magistrates\' Court' },
      { code: 'B52OZ', name: 'Yeovil Magistrates\' Court' },
      { code: 'B12PA', name: 'York Magistrates\' Court' }
    ],
    case: {
      files: {
        mime: {
          allow: [
          ]
        },
        extension: {
          allow: [
            '.csv',
            '.doc',
            '.docx',
            '.jpg',
            '.jpeg',
            '.xml',
            '.ods',
            '.odt',
            '.pdf',
            '.png',
            '.ppt',
            '.pptx',
            '.rdf',
            '.rtf',
            '.txt',
            '.xls',
            '.xlsx',
            '.xml',
            '.zip'
          ]
        },
        select: {
          max: 10
        }
      }
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false')
  },
  session: {
    secret: get('SESSION_SECRET', 'prepare-a-case-insecure-default-session', requiredInProduction),
    expiry: get('WEB_SESSION_TIMEOUT_IN_MINUTES', 60 * 12),
    cookieOptions: { maxAge: 365 * 24 * 60 * 60 * 1000 }
  },
  apis: {
    userPreferenceService: {
      url: get('USER_PREFERENCE_SERVICE_URL', 'http://localhost:9090', requiredInProduction)
    },
    courtCaseService: {
      url: get('COURT_CASE_SERVICE_URL', 'http://localhost:9090', requiredInProduction)
    },
    oauth2: {
      url: get('NOMIS_AUTH_URL', 'http://localhost:9090/auth'),
      redirect: get('NOMIS_AUTH_URL_REDIRECT', get('NOMIS_AUTH_URL', 'http://localhost:9090/auth')),
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
  maintenanceModeEnabled: getBooleanParam('MAINTENANCE_MODE'),
  domain: `${get('INGRESS_URL', `http://localhost:${port}`)}`,
  https: production,
  nonce: () => crypto.randomBytes(16).toString('base64'),
  connectionString: get('APPLICATIONINSIGHTS_CONNECTION_STRING', null),
  notification: {
    username: get('NOTIFICATION_USERNAME', null, requiredInProduction),
    password: get('NOTIFICATION_PASSWORD', null, requiredInProduction)
  },
  features: {
    sendPncAndCroWithOffenderUpdates: false,
    persistFilters: get('PERSIST_FILTERS', 'true'),
    clickAnalytics: get('ENABLE_CLICK_ANALYTICS', 'false')
  }
}
