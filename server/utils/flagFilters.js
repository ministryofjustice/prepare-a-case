module.exports = function (selectedFilters, caseListFilters) {
  if (selectedFilters) {
    caseListFilters.filter(caseListFilter => !!selectedFilters[caseListFilter.id]).forEach(caseListFilter => {
      const selectedValues = selectedFilters[caseListFilter.id]
      const isCourt = caseListFilter.id === 'courtRoom'
      const multipleSelection = Array.isArray(selectedValues)
      caseListFilter.items.forEach(item => {
        // courtrooms can be arrays here and in selected filters they are csv so convert array to csv for comparison
        const compareItemValue = isCourt && Array.isArray(item.value) ? item.value.join(',') : item.value
        item.checked = item.checked || (multipleSelection ? selectedValues.includes(compareItemValue) : selectedValues === compareItemValue)
      })
    })
  }
  return caseListFilters
}
