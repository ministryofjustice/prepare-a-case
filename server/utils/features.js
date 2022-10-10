const { allOf, mainFeatureToggleEnabled, enabledForSourceTypes, enabledForCourts, enabledForUsers, isEnv, anyOf } = require('./featureTogglePredicates')

const features = {
  caseComments: anyOf(
    allOf(
      isEnv('dev'),
      mainFeatureToggleEnabled('enableCaseComments')
    ),
    allOf(
      isEnv('preprod'),
      mainFeatureToggleEnabled('enableCaseComments'),
      enabledForCourts('B50KH'),
      enabledForUsers('***REMOVED***', '***REMOVED***')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseComments'),
      enabledForCourts('B50KH'),
      enabledForUsers('***REMOVED***', 'BEVERLYWILMOTTNPS', '***REMOVED***', '***REMOVED***', '***REMOVED***')
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
      enabledForCourts('B50KH'),
      enabledForUsers('***REMOVED***', '***REMOVED***')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseProgress'),
      enabledForCourts('B50KH'),
      enabledForUsers('***REMOVED***', 'BEVERLYWILMOTTNPS', '***REMOVED***', '***REMOVED***', '***REMOVED***')
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
      enabledForCourts('B50KH'),
      enabledForUsers('***REMOVED***', '***REMOVED***')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enablePastCasesNavigation'),
      enabledForCourts('B50KH'),
      enabledForUsers('***REMOVED***', 'BEVERLYWILMOTTNPS', '***REMOVED***', '***REMOVED***', '***REMOVED***')
    )
  ),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA')
}

module.exports = features
