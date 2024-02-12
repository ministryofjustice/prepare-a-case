const { getNormalisedCourtRoom } = require('../routes/helpers')

module.exports = (caseListData, selectedFilters) => {
  caseListData ||= []

  const availableProbationStatuses = [...new Set(caseListData.map(item => item.probationStatus))]
  const probationStatuses = []
  const statusOrder = ['Current', 'Pre-sentence record', 'Previously known', 'No record', 'Possible NDelius record']
  statusOrder.forEach(status => {
    if (availableProbationStatuses.includes(status)) {
      probationStatuses.push({ label: status, value: status })
    }
  })

  const courtRoomStrings = [...new Set(caseListData.map(item => item.courtRoom))]
    .filter(item => isNaN(item))
    .sort((a, b) => a - b)
    .map(item => item && {
      label: getNormalisedCourtRoom(item),
      value: item.toString()
    })

  const courtRooms = [...new Set(caseListData.map(item => parseInt(item.courtRoom, 10)))]
    .filter(item => !isNaN(item))
    .sort((a, b) => a - b)
    .map(item => item && { label: getNormalisedCourtRoom(item), value: ('0' + item.toString()).slice(-2) })
    .concat(courtRoomStrings)

  const availableSessions = [...new Set(caseListData.map(item => item.session))]
  const sessions = []
  const sessionOrder = ['MORNING', 'AFTERNOON']
  sessionOrder.forEach(session => {
    if (availableSessions.includes(session)) {
      sessions.push({ label: session[0] + session.toLowerCase().slice(1), value: session })
    }
  })

  const caseListFilters = [
    { id: 'probationStatus', label: 'Probation status', items: probationStatuses },
    { id: 'courtRoom', label: 'Courtroom', items: courtRooms, matcher: (courtCase, filter) => getNormalisedCourtRoom(courtCase.courtRoom) === filter.label },
    { id: 'session', label: 'Session', items: sessions }
  ]

  caseListFilters.push({ id: 'breach', label: 'Flag', items: [{ label: 'Breach', value: 'true' }] })

  const availableSources = [...new Set(caseListData.filter(item => item.source !== undefined).map(item => item.source))]

  if (availableSources.length > 1) {
    caseListFilters.splice(3, 0, { id: 'source', label: 'Source', items: [{ label: 'Common Platform', value: 'COMMON_PLATFORM' }, { label: 'Libra', value: 'LIBRA' }] })
  }

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
