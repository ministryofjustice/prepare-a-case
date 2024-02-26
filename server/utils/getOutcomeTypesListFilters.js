const { getOutcomeTypes } = require('../../server/services/case-service')

module.exports = async () => {
  console.log('getOutcomeTypes', getOutcomeTypes)
  const outcomeTypes = await getOutcomeTypes()

  return { id: 'outcomeType', label: 'Outcome type', items: outcomeTypes.types }
}
