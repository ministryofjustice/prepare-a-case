module.exports = (caseListData, selectedFilters) => {
  const probationStatuses = [...new Set(caseListData.map(item => item.probationStatus))]
    .map(item => {
      return item && { label: item.toString(), value: item.toString() }
    })

  const courtRooms = [...new Set(caseListData.map(item => parseInt(item.courtRoom, 10)))]
    .sort((a, b) => a - b)
    .map(item => {
      return item && { label: item.toString(), value: ('0' + item.toString()).slice(-2) }
    })

  const caseListFilters = [{
    id: 'probationStatus',
    label: 'Probation status',
    items: probationStatuses || []
  }, {
    id: 'courtRoom',
    label: 'Courtroom',
    items: courtRooms || []
  }, {
    id: 'session',
    label: 'Session',
    items: [{
      value: 'MORNING',
      label: 'Morning'
    }, {
      value: 'AFTERNOON',
      label: 'Afternoon'
    }]
  }]

  // Ensure selected filters are type Array
  if (selectedFilters) {
    Object.keys(selectedFilters).forEach(item => {
      if (typeof selectedFilters[item] === 'string') {
        selectedFilters[item] = new Array(selectedFilters[item])
      }
    })
  }

  // Flag selected filters
  caseListFilters.forEach(item => {
    item.items.forEach(obj => {
      if (obj) {
        Object.keys(obj).forEach(() => {
          if (selectedFilters && selectedFilters[item.id]) {
            selectedFilters[item.id].forEach(selection => {
              obj.checked = obj.checked || obj.value === selection
            })
          }
        })
      }
    })
  })

  return caseListFilters
}
