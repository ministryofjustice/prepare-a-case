const { allOf, mainFeatureToggleEnabled, enabledForSourceTypes, enabledForCourts, enabledForUsers, isEnv, anyOf } = require('./featureTogglePredicates')
const { settings } = require('../../config')

const LIVERPOOL_PRE_PILOT_USERS = ['***REMOVED***', '***REMOVED***', '***REMOVED***', '***REMOVED***', '***REMOVED***']

const features = {
  caseComments: anyOf(
    allOf(
      isEnv('dev'),
      mainFeatureToggleEnabled('enableCaseComments')
    ),
    allOf(
      isEnv('preprod'),
      mainFeatureToggleEnabled('enableCaseComments'),
      enabledForCourts('B50KH', 'B05PK'),
      enabledForUsers(...settings.caseTrackingPrePilotUsers)
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseComments'),
      anyOf(
        allOf(
          enabledForCourts('B50KH'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers)
        ),
        allOf(
          enabledForCourts('B05PK'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers, ...LIVERPOOL_PRE_PILOT_USERS)
        )
      )
    )
  ),
  caseProgress: anyOf(
    allOf(
      isEnv('dev'),
      mainFeatureToggleEnabled('enableCaseProgress')
    ),
    allOf(
      isEnv('preprod'),
      mainFeatureToggleEnabled('enableCaseProgress'),
      enabledForCourts('B50KH', 'B05PK'),
      enabledForUsers(...settings.caseTrackingPrePilotUsers)
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseProgress'),
      anyOf(
        allOf(
          enabledForCourts('B50KH'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers)
        ),
        allOf(
          enabledForCourts('B05PK'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers, ...LIVERPOOL_PRE_PILOT_USERS)
        )
      )
    )
  ),
  pastCasesNavigation: anyOf(
    allOf(
      isEnv('dev'),
      mainFeatureToggleEnabled('enablePastCasesNavigation')
    ),
    allOf(
      isEnv('preprod'),
      mainFeatureToggleEnabled('enablePastCasesNavigation'),
      enabledForCourts('B50KH', 'B05PK'),
      enabledForUsers(...settings.caseTrackingPrePilotUsers)
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enablePastCasesNavigation'),
      anyOf(
        allOf(
          enabledForCourts('B50KH'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers)
        ),
        allOf(
          enabledForCourts('B05PK'),
          enabledForUsers(...settings.caseTrackingPrePilotUsers, ...LIVERPOOL_PRE_PILOT_USERS)
        )
      )
    )
  ),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA')
}

module.exports = features
