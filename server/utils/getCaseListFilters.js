module.exports = (caseListData, selectedFilters) => {
  const availableProbationStatuses = [...new Set(caseListData.map(item => item.probationStatus))]
  const probationStatuses = []
  const statusOrder = ['Current', 'Pre-sentence record', 'Previously known', 'No record', 'Possible NDelius record']
  statusOrder.forEach(status => {
    if (availableProbationStatuses.includes(status)) {
      probationStatuses.push({ label: status, value: status })
    }
  })

  const courtRooms = [...new Set(caseListData.map(item => parseInt(item.courtRoom, 10)))]
    .sort((a, b) => a - b)
    .map(item => {
      return item && { label: item.toString(), value: ('0' + item.toString()).slice(-2) }
    })

  const availableSessions = [...new Set(caseListData.map(item => item.session))]
  const sessions = []
  const sessionOrder = ['MORNING', 'AFTERNOON']
  sessionOrder.forEach(session => {
    if (availableSessions.includes(session)) {
      sessions.push({ label: session[0] + session.toLowerCase().slice(1), value: session })
    }
  })

  const caseListFilters = [{ id: 'probationStatus', label: 'Probation status', items: probationStatuses },
    { id: 'courtRoom', label: 'Courtroom', items: courtRooms },
    { id: 'session', label: 'Session', items: sessions }]

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
