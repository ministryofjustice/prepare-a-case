const { getNormalisedCourtRoom } = require('../routes/helpers')
module.exports = ({ cases: caseListData, filters }, selectedFilters) => {
  const availableProbationStatuses = filters?.probationStatus || []
  const probationStatuses = []
  const statusOrder = ['Current', 'Pre-sentence record', 'Previously known', 'No record', 'Possible NDelius record']
  statusOrder.forEach(status => {
    if (availableProbationStatuses.includes(status)) {
      probationStatuses.push({ label: status, value: status })
    }
  })

  const availableCourtRooms = filters?.courtRoom || []
  const courtRoomStrings = availableCourtRooms
    .filter(item => isNaN(item))
    .sort((a, b) => a - b)
    .map(item => item && {
      label: getNormalisedCourtRoom(item),
      value: item.toString()
    })

  const courtRooms = [...new Set(availableCourtRooms.map(courtRoom => parseInt(courtRoom, 10)))]
    .filter(item => !isNaN(item))
    .sort((a, b) => a - b)
    .map(item => item && { label: getNormalisedCourtRoom(item), value: ('0' + item.toString()).slice(-2) })
    .concat(courtRoomStrings)

  const availableSessions = filters?.session || []
  const sessions = []
  const sessionOrder = ['MORNING', 'AFTERNOON']
  sessionOrder.forEach(session => {
    if (availableSessions.includes(session)) {
      sessions.push({ label: session[0] + session.toLowerCase().slice(1), value: session })
    }
  })

  const caseListFilters = [{ id: 'probationStatus', label: 'Probation status', items: probationStatuses },
    { id: 'courtRoom', label: 'Courtroom', items: courtRooms, matcher: (courtCase, filter) => getNormalisedCourtRoom(courtCase.courtRoom) === filter.label },
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
  caseListFilters?.forEach(item => {
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
