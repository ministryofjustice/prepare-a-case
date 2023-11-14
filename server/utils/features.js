const {
  allOf, mainFeatureToggleEnabled, enabledForSourceTypes, enabledForCourts, enabledForUsers, isEnv, anyOf, enabledForAll
} = require('./featureTogglePredicates')
const { settings } = require('../../config')

const LIVERPOOL_PRE_PILOT_USERS = ['TaylorColinoNPS', 'debbieleenps', 'emmacaddicknps', 'qml95k', 'brn63n']

const PLYMOUTH_MAGS_COURT_CODE = 'B50KH'

const PILOT_COURTS = ['B20EB', 'B23HS']

const features = {
  searchFeature: enabledForAll(),
  caseComments: enabledForAll(),
  caseProgress: enabledForAll(),
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
          enabledForUsers(...settings.caseTrackingPrePilotUsers, ...LIVERPOOL_PRE_PILOT_USERS)
        ),
        enabledForCourts(...PILOT_COURTS)
      )
    )
  ),
  serverSidePaging: allOf(
    mainFeatureToggleEnabled('enableServerSidePaging'),
    isEnv('dev', 'preprod', 'prod')
  ),
  pastCasesNavigation: enabledForAll(),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA'),
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
  ),
  advancedFilters: isEnv('dev', 'preprod', 'prod')
}

module.exports = features
