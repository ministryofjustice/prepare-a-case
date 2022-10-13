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
      enabledForUsers('joana.aguia', 'tony.howard')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseComments'),
      enabledForCourts('B50KH'),
      enabledForUsers('ZAP37S', 'BEVERLEYWILLMOTTNPS', 'ZRX14Y', 'wyi97r', 'mdy87w')
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
      enabledForUsers('joana.aguia', 'tony.howard')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseProgress'),
      enabledForCourts('B50KH'),
      enabledForUsers('ZAP37S', 'BEVERLEYWILLMOTTNPS', 'ZRX14Y', 'wyi97r', 'mdy87w')
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
      enabledForUsers('joana.aguia', 'tony.howard')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enablePastCasesNavigation'),
      enabledForCourts('B50KH'),
      enabledForUsers('ZAP37S', 'BEVERLEYWILLMOTTNPS', 'ZRX14Y', 'wyi97r', 'mdy87w')
    )
  ),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA')
}

module.exports = features
