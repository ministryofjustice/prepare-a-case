const { enabledForAll } = require('./featureTogglePredicates')

const features = {
  caseComments: enabledForAll(),
  caseProgress: enabledForAll(),
  pastCasesNavigation: enabledForAll(),
  caseProgressNextAppearanceBadge: enabledForAll()
}

module.exports = features
