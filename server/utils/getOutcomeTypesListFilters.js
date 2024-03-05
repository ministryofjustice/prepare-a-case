const { getOutcomeTypes } = require('../../server/services/case-service')

module.exports = async () => {
  const outcomeTypes = await getOutcomeTypes()

  return { id: 'outcomeType', label: 'Outcome type', items: outcomeTypes }
}
