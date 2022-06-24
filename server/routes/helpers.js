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

module.exports = {
  getPsrRequestedConvictions
}
