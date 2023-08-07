module.exports = (selectedSorts) => {
  const caseListSorts = [{ id: 'hearingDate', value: 'NONE' }]

  // Ensure selected filters are type Array
  if (selectedSorts) {
    Object.keys(selectedSorts).forEach(item => {
      if (typeof selectedSorts[item] === 'string') {
        selectedSorts[item] = new Array(selectedSorts[item])
      }
    })
  }

  // change hidden inputs to selected values
  caseListSorts.forEach(item => {
    if (selectedSorts && selectedSorts[item.id]) {
      item.value = selectedSorts[item.id][0]
    }
  })

  return caseListSorts
}
