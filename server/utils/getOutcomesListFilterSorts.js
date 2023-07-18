module.exports = (selectedFilterSorts) => {
  const outcomeTypes = [
    { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
    { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
    { label: 'Report requested', value: 'REPORT_REQUESTED' },
    { label: 'Adjourned', value: 'ADJOURNED' },
    { label: 'Committed to Crown', value: 'COMMITTED_TO_CROWN' },
    { label: 'Crown plus PSR', value: 'CROWN_PLUS_PSR' },
    { label: 'Other', value: 'OTHER' }
  ]

  const caseListFilters = [{ id: 'outcomeType', label: 'Outcome type', items: outcomeTypes }]
  const caseListSorts = [{ id: 'hearingDate', value: 'NONE' }]

  // Ensure selected filters are type Array
  if (selectedFilterSorts) {
    Object.keys(selectedFilterSorts).forEach(item => {
      if (typeof selectedFilterSorts[item] === 'string') {
        selectedFilterSorts[item] = new Array(selectedFilterSorts[item])
      }
    })
  }

  // Flag selected filters
  caseListFilters.forEach(item => {
    item.items.forEach(obj => {
      if (obj) {
        Object.keys(obj).forEach(() => {
          if (selectedFilterSorts && selectedFilterSorts[item.id]) {
            selectedFilterSorts[item.id].forEach(selection => {
              obj.checked = obj.checked || obj.value === selection
            })
          }
        })
      }
    })
  })

  // change hidden inputs to selected values
  caseListSorts.forEach(item => {
    if (selectedFilterSorts && selectedFilterSorts[item.id]) {
      item.value = selectedFilterSorts[item.id][0]
    }
  })

  return {
    filters: caseListFilters,
    sorts: caseListSorts
  }
}
