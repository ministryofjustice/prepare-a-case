const { enabledForAll, allOf, masterFeatureToggleEnabled } = require('./featureTogglePredicates')

const features = {
  caseComments: allOf(masterFeatureToggleEnabled('enableCaseComments'), enabledForAll()),
  caseProgress: allOf(masterFeatureToggleEnabled('enableCaseProgress'), enabledForAll())
}

module.exports = features
