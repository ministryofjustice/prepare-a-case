/* global describe, it, expect, jest */
const getOutcomeTypesListFilters = require('../../server/utils/getOutcomeTypesListFilters')
const caseService = require('../../server/services/case-service')

jest.mock('../../server/services/case-service', () => {
  return {
    getOutcomeTypes: jest.fn(() => [
      { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
      { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
      { label: 'Report requested', value: 'REPORT_REQUESTED' },
      { label: 'Adjourned', value: 'ADJOURNED' },
      { label: 'Committed to Crown', value: 'COMMITTED_TO_CROWN' },
      { label: 'Crown plus PSR', value: 'CROWN_PLUS_PSR' },
      { label: 'No outcome', value: 'NO_OUTCOME' },
      { label: 'Other', value: 'OTHER' }
    ])
  }
})

describe('getOutcomeTypesListFilters', () => {
  it('Should return list of outcome types', async () => {
    const outcomeTypes = await getOutcomeTypesListFilters()

    expect(outcomeTypes).toEqual({
      id: 'outcomeType',
      label: 'Outcome type',
      items: 'some-outcome-types'
    })
  })
})
