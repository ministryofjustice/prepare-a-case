const dotenv = require('dotenv')
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const courts = require('./data/courts.json')

const envPath = path.resolve(__dirname, './local.env')
if (fs.existsSync(envPath)) {
  console.log(envPath)
  dotenv.config({ path: envPath, override: true })
}

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
    availableCourts: courts,
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
    },
    flipt: {
      fliptUrl: get('FLIPT_URL', process.env.FLIPT_URL),
      fliptToken: get('FLIPT_API_KEY', process.env.FLIPT_API_KEY)
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
