const addedCasesList = {
  local: {
    court: 'Sheffield Magistrates\' Court',
    list: [
      {
        defendant: 'Sara Ortega',
        probationStatus: 'Previously known',
        breach: true,
        sso: true,
        offence: '*Assault by beating',
        listing: '3rd',
        session: 'Morning',
        court: '3'
      },
      {
        defendant: 'Obrien Mccall',
        probationStatus: 'No record',
        breach: false,
        sso: true,
        offence: '*Theft from a shop',
        listing: '2nd',
        session: 'Morning',
        court: '8'
      },
      {
        defendant: 'Lloyd Humphrey',
        probationStatus: 'Previously known',
        offence: '*Assault by beating',
        listing: '1st',
        session: 'Morning',
        court: '8'
      },
      {
        defendant: 'Janis Woods',
        probationStatus: 'No record',
        offence: '*Theft from a shop',
        listing: '3rd',
        session: 'Morning',
        court: '1'
      }
    ]
  }
}

module.exports = {
  addedCasesList
}
