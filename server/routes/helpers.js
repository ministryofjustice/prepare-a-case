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

const getLastSentencedConvictionPSR = communityResponse => {
  return communityResponse.convictions?.filter(conviction => conviction.sentence?.sentenceId && conviction.documents?.length)
    .flatMap(c => c.documents)
    ?.filter(d => d.type === 'COURT_REPORT_DOCUMENT' && d.reportDocumentDates?.completedDate)
    ?.sort((a, b) => new Date(b.reportDocumentDates.completedDate) - new Date(a.reportDocumentDates.completedDate))[0]
}

const getNormalisedCourtRoom = courtRoomStr => isNaN(courtRoomStr)
  ? (courtRoomStr.includes('Courtroom') ? courtRoomStr.replace(/([A-Za-z 0]*)?/, '') : courtRoomStr.replace(/([0]*)?/, ''))
  : parseInt(courtRoomStr).toString()

module.exports = {
  getPsrRequestedConvictions,
  getLastSentencedConvictionPSR,
  getNormalisedCourtRoom
}
