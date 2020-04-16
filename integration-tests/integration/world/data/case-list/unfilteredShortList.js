const unfilteredShortList = {
  local: {
    route: 'cases/2020-01-02',
    court: 'Sheffield Magistrates\' Court',
    list: [
      {
        defendant: 'Gill Arnold',
        probationStatus: 'Current',
        breach: true,
        offence: 'Theft from the person of another',
        listing: '3rd',
        session: 'Morning',
        court: '1'
      },
      {
        defendant: 'Cornelia Mccoy',
        probationStatus: 'Previously known',
        breach: true,
        sso: true,
        terminationDate: 'Order ended 1 January 2010',
        offence: '*Assault by beating',
        listing: '2nd',
        session: 'Morning',
        court: '1'
      },
      {
        defendant: 'Moses Hawkins',
        probationStatus: 'Current',
        offence: 'Assault by beating',
        listing: '2nd',
        session: 'Morning',
        court: '7'
      },
      {
        defendant: 'Jessie Ray',
        probationStatus: 'No record',
        offence: '*Attempt theft from the person of another',
        listing: '3rd',
        session: 'Morning',
        court: '1'
      },
      {
        defendant: 'Shelton Lamb',
        probationStatus: 'No record',
        sso: true,
        offence: '*Theft from the person of another',
        listing: '3rd',
        session: 'Morning',
        court: '8'
      }
    ]
  },
  dev: {
    route: 'cases/2020-01-02',
    court: 'Sheffield Magistrates\' Court',
    list: []
  }
}

module.exports = {
  unfilteredShortList
}
