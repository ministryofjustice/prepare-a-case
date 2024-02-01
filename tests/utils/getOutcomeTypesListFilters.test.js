/* global describe, it, expect */
const getOutcomeTypesListFilters = require('../../server/utils/getOutcomeTypesListFilters')

describe('getOutcomeTypesListFilters', () => {
  const expectedOutcomeTypes = [
    { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
    { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
    { label: 'Report requested', value: 'REPORT_REQUESTED' },
    { label: 'Adjourned', value: 'ADJOURNED' },
    { label: 'Committed to Crown', value: 'COMMITTED_TO_CROWN' },
    { label: 'Crown plus PSR', value: 'CROWN_PLUS_PSR' },
    { label: 'No outcome', value: 'NO_OUTCOME' },
    { label: 'Other', value: 'OTHER' }
  ]

  it('Should return list of outcome types', () => {
    const outcomeTypes = getOutcomeTypesListFilters()

    expect(outcomeTypes).toEqual({ id: 'outcomeType', label: 'Outcome type', items: expectedOutcomeTypes })
  })
})
