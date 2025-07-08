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
      { code: 'B63AD', name: 'Aberystwyth Magistrates Court', pilotCourt: false },
      { code: 'B44AG', name: 'Aldershot Magistrates\' Court', pilotCourt: false },
      { code: 'B52BB', name: 'Bath Law Courts', pilotCourt: false },
      { code: 'B01KR', name: 'Barkingside Magistrates\' Court', pilotCourt: false },
      { code: 'B14AV', name: 'Barnsley Law Courts', pilotCourt: false },
      { code: 'B50AW', name: 'Barnstaple Magistrates\' Court', pilotCourt: false },
      { code: 'B03AX', name: 'Barrow-in-Furness Magistrates\' Court', pilotCourt: false },
      { code: 'B42AZ', name: 'Basildon Magistrates\' Court and Family Court', pilotCourt: false },
      { code: 'B44BA', name: 'Basingstoke Magistrates\' Court', pilotCourt: true },
      { code: 'B01BE', name: 'Belmarsh Magistrates\' Court', pilotCourt: false },
      { code: 'B10BF', name: 'Berwick upon Tweed Magistrates\' Court', pilotCourt: false },
      { code: 'B16BG', name: 'Beverley Magistrates\' Court', pilotCourt: false },
      { code: 'B01BH', name: 'Bexley Magistrates\' Court', pilotCourt: false },
      { code: 'B20BL', name: 'Birmingham Magistrates\' Court', pilotCourt: false },
      { code: 'B04BP', name: 'Blackburn Magistrates\' Court', pilotCourt: false },
      { code: 'B04BQ', name: 'Blackpool Magistrates\' and Civil Court', pilotCourt: false },
      { code: 'B50BU', name: 'Bodmin Magistrates\' Court', pilotCourt: false },
      { code: 'B06BV', name: 'Bolton Magistrates\' Court', pilotCourt: false },
      { code: 'B32BX', name: 'Boston Magistrates\' Court', pilotCourt: false },
      { code: 'B13CC', name: 'Bradford and Keighley Magistrates\' Court', pilotCourt: false },
      { code: 'B16CJ', name: 'Bridlington Magistrates\' Court', pilotCourt: false },
      { code: 'B47CL', name: 'Brighton Magistrates\' Court', pilotCourt: false },
      { code: 'B52CM', name: 'Bristol Magistrates\' Court', pilotCourt: false },
      { code: 'B01CN', name: 'Bromley Magistrates\' Court', pilotCourt: false },
      { code: 'B04CO', name: 'Burnley Magistrates\' Court', pilotCourt: false },
      { code: 'B60WU', name: 'Caernarfon Justice Centre', pilotCourt: false },
      { code: 'B35CZ', name: 'Cambridge Magistrates\' Court', pilotCourt: false },
      { code: 'B21DA', name: 'Cannock Magistrates\' Court', pilotCourt: false },
      { code: 'B46DB', name: 'Canterbury Magistrates\' Court', pilotCourt: false },
      { code: 'B62DC', name: 'Cardiff Magistrates\' Court', pilotCourt: false },
      { code: 'B03DE', name: 'Carlisle Magistrates\' Court', pilotCourt: false },
      { code: 'B42CM', name: 'Chelmsford Magistrates\' Court and Family Court', pilotCourt: false },
      { code: 'B53DJ', name: 'Cheltenham Magistrates\' Court', pilotCourt: false },
      { code: 'B07DM', name: 'Chester Magistrates\' Court', pilotCourt: false },
      { code: 'B53DT', name: 'Cirencester Magistrates\' Court', pilotCourt: false },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court', pilotCourt: false },
      { code: 'B01DU', name: 'City of London Magistrates\' Court', pilotCourt: false },
      { code: 'B42CO', name: 'Colchester Magistrates\' Court and Family Court', pilotCourt: false },
      { code: 'B20EB', name: 'Coventry Magistrates\' Court', pilotCourt: true },
      { code: 'B47EC', name: 'Crawley Magistrates\' Court', pilotCourt: false },
      { code: 'B07ED', name: 'Crewe (South Cheshire) Magistrates\' Court', pilotCourt: false },
      { code: 'B01EF', name: 'Croydon Magistrates\' Court', pilotCourt: false },
      { code: 'B61EH', name: 'Cwmbran Magistrates\' Court', pilotCourt: false },
      { code: 'B11EI', name: 'Darlington Magistrates\' Court', pilotCourt: false },
      { code: 'B30PI', name: 'Derby Magistrates\' Court', pilotCourt: false },
      { code: 'B14ET', name: 'Doncaster Justice Centre North', pilotCourt: false },
      { code: 'B20EY', name: 'Dudley Magistrates\' Court', pilotCourt: false },
      { code: 'B01FA', name: 'Ealing Magistrates\' Court', pilotCourt: false },
      { code: 'B43LV', name: 'East Berkshire Magistrates\' Court, Slough', pilotCourt: true },
      { code: 'B50VR', name: 'Exeter Magistrates\' Court - North and East Devon', pilotCourt: false },
      { code: 'B46FO', name: 'Folkestone Magistrates\' Court', pilotCourt: false },
      { code: 'B10FR', name: 'Gateshead Magistrates\' Court', pilotCourt: false },
      { code: 'B36FZ', name: 'Great Yarmouth Magistrates\' Court', pilotCourt: false },
      { code: 'B16GB', name: 'Grimsby Magistrates\' Court', pilotCourt: false },
      { code: 'B45GC', name: 'Guildford Magistrates\' Court', pilotCourt: false },
      { code: 'B47GL', name: 'Hastings Magistrates\' Court', pilotCourt: false },
      { code: 'B41US', name: 'Hatfield Magistrates\' Court', pilotCourt: false },
      { code: 'B12GH', name: 'Harrogate Justice Centre', pilotCourt: false },
      { code: 'B63GN', name: 'Haverfordwest Magistrates\' Court', pilotCourt: false },
      { code: 'B01GQ', name: 'Hendon Magistrates\' Court', pilotCourt: false },
      { code: 'B22GR', name: 'Hereford Justice Centre', pilotCourt: false },
      { code: 'B43OX', name: 'High Wycombe Magistrates\' Court', pilotCourt: true },
      { code: 'B01GU', name: 'Highbury Corner Magistrates\' Court', pilotCourt: false },
      { code: 'B47HB', name: 'Horsham Magistrates\' Court', pilotCourt: false },
      { code: 'B16HE', name: 'Hull and Holderness Magistrates\' Court', pilotCourt: false },
      { code: 'B35HF', name: 'Huntingdon Law Courts', pilotCourt: false },
      { code: 'B37HI', name: 'Ipswich Magistrates\' Court', pilotCourt: false },
      { code: 'B44JK', name: 'Isle of Wight Magistrates\' Court', pilotCourt: true },
      { code: 'B22HM', name: 'Kidderminster Magistrates\' Court', pilotCourt: false },
      { code: 'B36HN', name: 'King\'s Lynn Magistrates\' Court', pilotCourt: false },
      { code: 'B13HD', name: 'Kirklees (Huddersfield) Magistrates\' Court', pilotCourt: false },
      { code: 'B04HQ', name: 'Lancaster Courthouse', pilotCourt: false },
      { code: 'B01LY', name: 'Lavender Hill Magistrates\' Court', pilotCourt: false },
      { code: 'B23HS', name: 'Leamington Spa Magistrates\' Court', pilotCourt: true },
      { code: 'B13HT', name: 'Leeds Magistrates\' Court', pilotCourt: false },
      { code: 'B33HU', name: 'Leicester Magistrates\' Court', pilotCourt: false },
      { code: 'B32HX', name: 'Lincoln Magistrates\' Court', pilotCourt: false },
      { code: 'B05PK', name: 'Liverpool & Knowsley Magistrates\' Court', pilotCourt: false },
      { code: 'B63IC', name: 'Llandrindod Wells Magistrates\'', pilotCourt: false },
      { code: 'B60ID', name: 'Llandudno Magistrates\' Court', pilotCourt: false },
      { code: 'B63IE', name: 'Llanelli Law Courts', pilotCourt: false },
      { code: 'B33II', name: 'Loughborough Magistrates\' Court', pilotCourt: false },
      { code: 'B40IM', name: 'Luton and South Bedfordshire Magistrates\' Court', pilotCourt: false },
      { code: 'B46IR', name: 'Maidstone Magistrates\' Court', pilotCourt: false },
      { code: 'B06IS', name: 'Manchester Magistrates\' Court', pilotCourt: false },
      { code: 'B31IT', name: 'Mansfield Magistrates\' and County Court', pilotCourt: false },
      { code: 'B46IU', name: 'Margate Magistrates\' Court', pilotCourt: false },
      { code: 'B46DH', name: 'Medway Magistrates\' Court', pilotCourt: false },
      { code: 'B62IZ', name: 'Merthyr Tydfil Combined Court Centre', pilotCourt: false },
      { code: 'B10BD', name: 'Mid and South East Northumberland Law Courts', pilotCourt: false },
      { code: 'B43JC', name: 'Milton Keynes Magistrates\' Court', pilotCourt: true },
      { code: 'B60JE', name: 'Mold Justice Centre', pilotCourt: false },
      { code: 'B10JL', name: 'Newcastle Magistrates\' Court', pilotCourt: false },
      { code: 'B61NP', name: 'Newport (South Wales) Magistrates\' Court', pilotCourt: false },
      { code: 'B50JO', name: 'Newton Abbot Magistrates\' Court', pilotCourt: false },
      { code: 'B11JP', name: 'Newton Aycliffe Magistrates\' Court', pilotCourt: false },
      { code: 'B30PG', name: 'North East Derbyshire & Dales (Chesterfield) Magistrates\' Court', pilotCourt: false },
      { code: 'B52OC', name: 'North Somerset Magistrates\' Court', pilotCourt: false },
      { code: 'B21JI', name: 'North Staffordshire Justice Centre', pilotCourt: false },
      { code: 'B10JQ', name: 'North Tyneside Magistrates\' Court', pilotCourt: false },
      { code: 'B34JS', name: 'Northampton Magistrates\' Court', pilotCourt: false },
      { code: 'B36JU', name: 'Norwich Magistrates\' Court', pilotCourt: false },
      { code: 'B31JV', name: 'Nottingham Magistrates\' Court', pilotCourt: false },
      { code: 'B23PP', name: 'Nuneaton Magistrates\' Court', pilotCourt: false },
      { code: 'B43KB', name: 'Oxford and Southern Oxfordshire Magistrates\' Court', pilotCourt: true },
      { code: 'B35KE', name: 'Peterborough Magistrates\' Court', pilotCourt: false },
      { code: 'B11KF', name: 'Peterlee Magistrates\' Court', pilotCourt: false },
      { code: 'B50KH', name: 'Plymouth Magistrates\' Court', pilotCourt: false },
      { code: 'B55KL', name: 'Poole Magistrates\' Court', pilotCourt: false },
      { code: 'B62KL', name: 'Port Talbot Justice Centre', pilotCourt: false },
      { code: 'B44KM', name: 'Portsmouth Magistrates\' Court', pilotCourt: true },
      { code: 'B04KO', name: 'Preston Magistrates\' Court', pilotCourt: false },
      { code: 'B43KQ', name: 'Reading Magistrates\' Court', pilotCourt: true },
      { code: 'B22KS', name: 'Redditch Magistrates\' Court', pilotCourt: false },
      { code: 'B01LA', name: 'Romford Magistrates\' Court', pilotCourt: false },
      { code: 'B54WV', name: 'Salisbury Law Courts', pilotCourt: false },
      { code: 'B12LK', name: 'Scarborough Justice Centre', pilotCourt: false },
      { code: 'B05BW', name: 'Sefton Magistrates\' Court', pilotCourt: false },
      { code: 'B46LN', name: 'Sevenoaks Magistrates\' Court', pilotCourt: false },
      { code: 'B42MB', name: 'Southend Magistrates\' Court', pilotCourt: false },
      { code: 'B14LO', name: 'Sheffield Magistrates\' Court', pilotCourt: false },
      { code: 'B12LT', name: 'Skipton Magistrates\' Court', pilotCourt: false },
      { code: 'B10LX', name: 'South Tyneside Magistrates\' Court', pilotCourt: false },
      { code: 'B22OS', name: 'South Worcestershire Magistrates\' Court', pilotCourt: false },
      { code: 'B42MB', name: 'Southend Magistrates\' Court', pilotCourt: false },
      { code: 'B41ME', name: 'St Albans Magistrates\' Court', pilotCourt: false },
      { code: 'B45MH', name: 'Staines Magistrates\' Court', pilotCourt: false },
      { code: 'B41MJ', name: 'Stevenage Magistrates\' Court', pilotCourt: false },
      { code: 'B06MK', name: 'Stockport Magistrates\' Court', pilotCourt: false },
      { code: 'B01MN', name: 'Stratford Magistrates\' Court', pilotCourt: false },
      { code: 'B10MR', name: 'Sunderland Magistrates\' Court', pilotCourt: false },
      { code: 'B62MV', name: 'Swansea Magistrates\' Court', pilotCourt: false },
      { code: 'B54MW', name: 'Swindon Magistrates\' Court', pilotCourt: false },
      { code: 'B06AN', name: 'Tameside Magistrates\' Court', pilotCourt: false },
      { code: 'B52MY', name: 'Taunton Magistrates\' Court', pilotCourt: false },
      { code: 'B17JA', name: 'Teesside Magistrates\' Court', pilotCourt: false },
      { code: 'B22MZ', name: 'Telford Magistrates\' Court', pilotCourt: false },
      { code: 'B01ND', name: 'Thames Magistrates\' Court', pilotCourt: false },
      { code: 'B50NL', name: 'Truro Magistrates\' Court', pilotCourt: false },
      { code: 'B01NM', name: 'Uxbridge Magistrates\' Court', pilotCourt: false },
      { code: 'B20NQ', name: 'Walsall Magistrates\' Court', pilotCourt: false },
      { code: 'B07FQ', name: 'Warrington Magistrates\' Court', pilotCourt: false },
      { code: 'B23HS', name: 'Warwick Combined Court', pilotCourt: false },
      { code: 'B34NX', name: 'Wellingborough Magistrates\' Court', pilotCourt: false },
      { code: 'B63NZ', name: 'Welshpool Magistrates\' Court', pilotCourt: false },
      { code: 'B03OT', name: 'West Cumbria Courthouse', pilotCourt: false },
      { code: 'B44MA', name: 'West Hampshire Magistrates\' Court', pilotCourt: true },
      { code: 'B01IX', name: 'Westminster Magistrates\' Court', pilotCourt: false },
      { code: 'B55OE', name: 'Weymouth Combined Court', pilotCourt: false },
      { code: 'B06OJ', name: 'Wigan and Leigh Magistrates\' Court', pilotCourt: false },
      { code: 'B01CE', name: 'Willesden Magistrates\' Court', pilotCourt: false },
      { code: 'B01OK', name: 'Wimbledon Magistrates\' Court', pilotCourt: false },
      { code: 'B05BK', name: 'Wirral Magistrates\' Court', pilotCourt: false },
      { code: 'B20OQ', name: 'Wolverhampton Magistrates\' Court', pilotCourt: false },
      { code: 'B22OS', name: 'Worcester Justice Centre', pilotCourt: false },
      { code: 'B47OV', name: 'Worthing Magistrates\' Court', pilotCourt: false },
      { code: 'B60OW', name: 'Wrexham Magistrates\' Court', pilotCourt: false },
      { code: 'B52OZ', name: 'Yeovil Magistrates\' Court', pilotCourt: false },
      { code: 'B12PA', name: 'York Magistrates\' Court', pilotCourt: false }
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
      url: get('USER_PREFERENCE_SERVICE_URL', 'http://localhost:9091', requiredInProduction)
    },
    courtCaseService: {
      url: get('COURT_CASE_SERVICE_URL', 'http://localhost:9091', requiredInProduction)
    },
    oauth2: {
      url: get('NOMIS_AUTH_URL', 'http://localhost:9091/auth'),
      redirect: get('NOMIS_AUTH_URL_REDIRECT', get('NOMIS_AUTH_URL', 'http://localhost:9091/auth')),
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
