const {
  allOf, mainFeatureToggleEnabled, enabledForSourceTypes, enabledForCourts, enabledForUsers, isEnv, anyOf, enabledForAll
} = require('./featureTogglePredicates')
const { settings } = require('../../config')

const LIVERPOOL_PRE_PILOT_USERS = ['TaylorColinoNPS', 'debbieleenps', 'emmacaddicknps', 'qml95k', 'brn63n']

const features = {
  searchFeature: anyOf(
    allOf(
      isEnv('dev', 'preprod')
    ),
    allOf(
      isEnv('prod'),
      enabledForUsers(...settings.caseSearchUsers)
    )
  ),
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
  caseProgress: enabledForAll(),
  hearingNotes: anyOf(
    allOf(
      isEnv('dev')
    ),
    allOf(
      isEnv('preprod'),
      enabledForCourts('B50KH', 'B05PK'),
      enabledForUsers(...settings.caseTrackingPrePilotUsers)
    ),
    allOf(
      isEnv('prod'),
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
  pastCasesNavigation: enabledForAll(),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA')
}

module.exports = features
