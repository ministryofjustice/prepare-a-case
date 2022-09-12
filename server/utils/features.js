const { enabledForAll, allOf, mainFeatureToggleEnabled, enabledForSourceTypes } = require('./featureTogglePredicates')

const features = {
  caseComments: allOf(mainFeatureToggleEnabled('enableCaseComments'), enabledForAll()),
  caseProgress: allOf(mainFeatureToggleEnabled('enableCaseProgress'), enabledForAll()),
  caseProgressNextAppearanceBadge: enabledForSourceTypes('COMMON_PLATFORM', 'LIBRA')
}

module.exports = features
