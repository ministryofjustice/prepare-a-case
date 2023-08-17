const getPsrRequestedConvictions = communityResponse => {
  return communityResponse.convictions?.filter(conviction => conviction.active && conviction.awaitingPsr && conviction.psrReports && conviction.psrReports.length)
    .map(conviction => {
      const mainOffence = conviction.offences.find(offence => offence.main)
      return {
        psrReport: conviction.psrReports[0],
        offence: mainOffence
      }
    })
}

const getOrderTitle = communityResponse => {
  return communityResponse.sentence.description + (communityResponse.sentence.length ? ' (' + communityResponse.sentence.length + ' ' + communityResponse.sentence.lengthUnits + ')' : '')
}

const getLastSentencedConvictionPSR = communityResponse => {
  return communityResponse.convictions?.filter(conviction => conviction.sentence?.sentenceId && conviction.documents?.length)
    .flatMap(c => c.documents)
    ?.filter(d => d.type === 'COURT_REPORT_DOCUMENT' && d.reportDocumentDates?.completedDate)
    ?.sort((a, b) => new Date(b.reportDocumentDates.completedDate) - new Date(a.reportDocumentDates.completedDate))[0]
}

const getNormalisedCourtRoom = courtRoomStr => isNaN(courtRoomStr)
  ? (courtRoomStr.includes('Courtroom') ? courtRoomStr.replace(/([A-Za-z 0]*)?/, '') : courtRoomStr.replace(/([0]*)?/, ''))
  : parseInt(courtRoomStr).toString()

const prepareCourtRoomFilters = (allCourtRooms) => {
  if (!allCourtRooms || !allCourtRooms.length) {
    return []
  }
  allCourtRooms = [...new Set(allCourtRooms)]

  const courtRoomStrings = allCourtRooms
    .filter(item => isNaN(getNormalisedCourtRoom(item)))
    .sort((a, b) => a === b ? 0 : (a > b ? 1 : -1))
    .map(item => item && {
      label: getNormalisedCourtRoom(item),
      value: item.toString()
    })

  // '01' and 'Courtroom 01' to be treated as '1' for displaying label but need to preserve the actual courtroom values separately to apply filters
  // So the below code converts a list of ['01', 'Courtroom 01'] to { label: '1', value: ['01', 'Courtroom 01']} which is rendered as value="01,Courtroom 01" in the html.
  // when this filter is submitted the csv need to be split and courtroom filter to be applied for both the rooms
  const numericCourtRoomMap = new Map()
  Array.from([...new Set(allCourtRooms.filter(item => !isNaN(parseInt(getNormalisedCourtRoom(item), 10))))])
    .forEach(value => {
      const label = getNormalisedCourtRoom(value)
      if (numericCourtRoomMap.has(label)) {
        numericCourtRoomMap.get(label).value.push(value)
      } else {
        numericCourtRoomMap.set(label, { label, value: [value] })
      }
    })

  const numericCourtRoomObjects = Array.from(numericCourtRoomMap.values()).sort((c1, c2) => c1.label - c2.label)

  const courtRooms = numericCourtRoomObjects
    .concat(courtRoomStrings)
  return courtRooms
}

module.exports = {
  getPsrRequestedConvictions,
  getLastSentencedConvictionPSR,
  getNormalisedCourtRoom,
  prepareCourtRoomFilters,
  getOrderTitle
}
