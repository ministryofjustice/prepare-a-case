module.exports = (selectedFilterSorts) => {
  const outcomeTypeOrder = ['Probation sentence', 'Non-probation sentence', 'Report requested', 'Adjourned', 'Committed to Crown', 'Crown plus PSR', 'Other']

  const outcomeTypes = outcomeTypeOrder.map(outcomeType => {
    return { label: outcomeType, value: outcomeType }
  })

  const caseListFilters = [{ id: 'hearingOutcomeType', label: 'Outcome type', items: outcomeTypes }]
  const caseListSorts = [{ id: 'hearingDate', value: 'none' }]

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
