const {
  allOf, mainFeatureToggleEnabled, enabledForSourceTypes, enabledForCourts, enabledForUsers, isEnv, anyOf, enabledForAll
} = require('./featureTogglePredicates')
const { settings } = require('../../config')

const LIVERPOOL_PRE_PILOT_USERS = ['***REMOVED***', '***REMOVED***', '***REMOVED***', '***REMOVED***', '***REMOVED***']

const PLYMOUTH_MAGS_COURT_CODE = 'B50KH'

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
      enabledForCourts(PLYMOUTH_MAGS_COURT_CODE, 'B05PK'),
      enabledForUsers(...settings.caseTrackingPrePilotUsers)
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
        )
      )
    )
  ),
  pastCasesNavigation: enabledForAll(),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA'),
  hearingOutcomes: allOf(
    isEnv('dev'),
    mainFeatureToggleEnabled('enableHearingOutcomes')
  ),
  advancedFilters: isEnv('dev', 'preprod')
}

module.exports = features
