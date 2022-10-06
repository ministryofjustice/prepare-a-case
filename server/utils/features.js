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
      enabledForUsers('Jo', 'Marg', 'Rebecca', 'Tony')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseComments'),
      enabledForCourts('B50KH'),
      enabledForUsers('ZRX14Y', 'BEVERLYWILMOTTNPS', 'Jo', 'Marg', 'Rebecca', 'Tony')
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
      enabledForUsers('Jo', 'Marg', 'Rebecca', 'Tony')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enableCaseProgress'),
      enabledForCourts('B50KH'),
      enabledForUsers('ZRX14Y', 'BEVERLYWILMOTTNPS', 'Jo', 'Marg', 'Rebecca', 'Tony')
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
      enabledForUsers('Jo', 'Marg', 'Rebecca', 'Tony')
    ),
    allOf(
      isEnv('prod'),
      mainFeatureToggleEnabled('enablePastCasesNavigation'),
      enabledForCourts('B50KH'),
      enabledForUsers('ZRX14Y', 'BEVERLYWILMOTTNPS', 'Jo', 'Marg', 'Rebecca', 'Tony')
    )
  ),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA')
}

module.exports = features
