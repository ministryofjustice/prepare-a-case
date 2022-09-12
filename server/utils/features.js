const { enabledForAll, allOf, mainFeatureToggleEnabled } = require('./featureTogglePredicates')

const features = {
  caseComments: allOf(mainFeatureToggleEnabled('enableCaseComments'), enabledForAll()),
  caseProgress: allOf(mainFeatureToggleEnabled('enableCaseProgress'), enabledForAll())
}

module.exports = features
