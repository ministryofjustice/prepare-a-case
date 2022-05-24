// sorts the map with a combo of numerics and string in ascending order pushing strings to bottom
const getSortedCourtRoomMap = (courtRoomMap) => {
  return new Map([...courtRoomMap.entries()].sort((e1, e2) => {
    const strA = e1.at(0);
    const strB = e2.at(0);
    const numA = parseInt(strA);
    const numB = parseInt(strB);
    if (isNaN(numB)) {
      if (isNaN(numA)) {
        return strA < strB ? -1 : 1;
      }
      return -1;
    }
    if (isNaN(numA)) {
      return 1
    }
    return numA - numB;
  }));
}

// Creates a map with unique courtroom as key and values are a csv of Libra & CP courtroom names/numbers
// eg. courtrooms [3, 'Courtroom 7', 7] will me reduced to { 3: '3', 7: '7, Courtroom 7' }
const groupCourtRoomsByRoomNumber = (uniqueCourtRooms) =>
   uniqueCourtRooms.reduce((reducedMap, courtRoom) => {
    let courtRoomStr = courtRoom.toString();
    var key = courtRoomStr.includes('Courtroom') ? courtRoomStr.replace(/([A-Za-z 0]*)?/, '') : courtRoomStr.replace(/([0]*)?/, '');
    const value = reducedMap.get(key)
    !!value ? reducedMap.set(key, [value, courtRoomStr].join()) : reducedMap.set(key, courtRoomStr)
    return reducedMap;
  }, new Map());


module.exports = (caseListData, selectedFilters) => {
  const availableProbationStatuses = [...new Set(caseListData.map(item => item.probationStatus))]
  const probationStatuses = []
  const statusOrder = ['Current', 'Pre-sentence record', 'Previously known', 'No record', 'Possible NDelius record']
  statusOrder.forEach(status => {
    if (availableProbationStatuses.includes(status)) {
      probationStatuses.push({ label: status, value: status })
    }
  })

  const uniqueCourtRooms = [...new Set(caseListData.map(item =>  item.courtRoom.toString())).values()];

  const courtRoomMap = groupCourtRoomsByRoomNumber(uniqueCourtRooms);

  const sortedCourtRoomMap = getSortedCourtRoomMap(courtRoomMap);

  const courtRooms = Array.from(sortedCourtRoomMap, ([key, value]) => ({ label: key, value }));

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
