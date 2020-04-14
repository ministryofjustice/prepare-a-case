const unfilteredListPage1 = {
  local: {
    court: 'Sheffield Magistrates\' Court',
    list: [
      {
        defendant: 'Kara Ayers',
        probationStatus: 'No record',
        breach: true,
        sso: true,
        offence: '*Assault by beating',
        listing: '1st',
        session: 'Morning',
        court: '10'
      },
      {
        defendant: 'Mann Carroll',
        probationStatus: 'No record',
        breach: true,
        offence: '*Assault by beating',
        listing: '3rd',
        session: 'Morning',
        court: '2'
      },
      {
        defendant: 'Guadalupe Hess',
        probationStatus: 'No record',
        offence: '*Attempt theft from the person of another',
        listing: '3rd',
        session: 'Morning',
        court: '7'
      }
    ]
  },
  dev: {
    court: 'Sheffield Magistrates\' Court',
    list: []
  }
}

module.exports = {
  unfilteredListPage1
}
