const unfilteredListPage3 = {
  local: {
    court: 'Sheffield Magistrates\' Court',
    list: [
      {
        defendant: 'Amanda McKay',
        probationStatus: 'Current',
        offence: '*Theft from the person of another',
        listing: '3rd',
        session: 'Morning',
        court: '1'
      },
      {
        defendant: 'Perry Delacruz',
        probationStatus: 'No record',
        breach: false,
        offence: '*Attempt theft from the person of another',
        listing: '1st',
        session: 'Morning',
        court: '1'
      },
      {
        defendant: 'Burgess Hartman',
        probationStatus: 'Previously known',
        breach: true,
        terminationDate: 'Order ended 16 November 2018',
        offence: '*Theft from a shop',
        listing: '2nd',
        session: 'Morning',
        court: '3'
      }
    ]
  }
}

module.exports = {
  unfilteredListPage3
}
