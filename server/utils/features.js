const {
  allOf, mainFeatureToggleEnabled, enabledForCourts, enabledForUsers, isEnv, anyOf, enabledForAll
} = require('./featureTogglePredicates')
const { settings } = require('../config')

const PLYMOUTH_MAGS_COURT_CODE = 'B50KH'

const KSS_MAGS_COURTS = ['B47CL', 'B47EC', 'B47GL', 'B47HB', 'B47OV']

const PILOT_COURTS_FROM_CONFIG = settings.availableCourts.filter(c => c.pilotCourt).flatMap(c => c.code)
const PILOT_COURTS = [...PILOT_COURTS_FROM_CONFIG, PLYMOUTH_MAGS_COURT_CODE, ...KSS_MAGS_COURTS]

const features = {
  hearingNotes: anyOf(
    allOf(
      isEnv('dev')
    ),
    allOf(
      isEnv('preprod'),
      anyOf(
        enabledForUsers(...settings.caseTrackingPrePilotUsers),
        enabledForCourts(...PILOT_COURTS)
      )
    ),
    allOf(
      isEnv('prod'),
      anyOf(
        allOf(
          enabledForCourts(PLYMOUTH_MAGS_COURT_CODE),
          enabledForUsers(...settings.caseTrackingPrePilotUsers)
        ),
        allOf(
          enabledForCourts('B05PK'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers, ...settings.liverpoolPrePilotUsers)
        ),
        enabledForCourts(...PILOT_COURTS)
      )
    )
  ),
  pastCasesNavigation: enabledForAll(),
  workflow: anyOf(
    allOf(
      isEnv('dev'),
      mainFeatureToggleEnabled('enableWorkflow')
    ),
    allOf(
      isEnv('preprod'),
      mainFeatureToggleEnabled('enableWorkflow'),
      enabledForCourts(...PILOT_COURTS)
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableWorkflow'),
      enabledForCourts(...PILOT_COURTS)
    )
  ),
  hearingOutcomes: anyOf(
    allOf(
      isEnv('dev'),
      mainFeatureToggleEnabled('enableHearingOutcomes')
    ),
    allOf(
      isEnv('preprod'),
      mainFeatureToggleEnabled('enableHearingOutcomes'),
      enabledForCourts(...PILOT_COURTS)
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableHearingOutcomes'),
      enabledForCourts(...PILOT_COURTS)
    )
  )
}

module.exports = features
