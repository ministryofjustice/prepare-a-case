module.exports = () => {
  const outcomeTypes = [
    { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
    { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
    { label: 'Report requested', value: 'REPORT_REQUESTED' },
    { label: 'Adjourned', value: 'ADJOURNED' },
    { label: 'Committed to Crown', value: 'COMMITTED_TO_CROWN' },
    { label: 'Crown plus PSR', value: 'CROWN_PLUS_PSR' },
    { label: 'Other', value: 'OTHER' }
  ]

  return { id: 'outcomeType', label: 'Outcome type', items: outcomeTypes }
}
