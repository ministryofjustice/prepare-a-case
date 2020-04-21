const currentDefendant = {
  local: {
    caseNo: 668911253,
    court: '6',
    session: 'morning',
    listing: '2nd',
    pnc: 'A/1234560BA',
    crn: 'DX12340A',
    name: 'Lenore Marquez',
    dateOfBirth: '1979-08-18',
    gender: 'Female',
    address: '38 Clarendon Road Glasgow AD21 5DR',
    nationality: 'Unknown',
    offence: 'Attempt theft from the person of another',
    offenceDetails: 'On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron.',
    offenceCaption: 'Contrary to section 1(1) of the Criminal Attempts Act 1981.',
    currentOrderCount: 3,
    currentOrderTitle: 'ORA Adult Custody (inc PSS)',
    currentOrderOffence: 'Stealing mail bags or postal packets or unlawfully taking away or opening mail bag - 04200',
    currentOrderStartDate: '2019-05-19',
    currentOrderEndDate: '2020-05-25',
    currentOrderId: '1403337513',
    currentOrderLastAttendance: '4 Mar 2020 - Planned office visit (Attended - Complied)',
    currentOrderAttendance: {
      counts: [10, 6, 2, 2, 1, 1, 0, 1, 1, 2, 2, 1],
      headings: ['Appointments to date', 'Complied', 'Failures to comply', 'Awaiting outcome'],
      types: ['Planned office visit', 'Unpaid work', 'Appointment with External Agency', 'IAPS / Accredited programme']
    },
    currentOrderRequirements: [
      'Unpaid Work (Regular) - 60 Hours',
      'Rehabilitation Activity Requirement (RAR) - 20 Days',
      'Court - Accredited Programme (ASRO)',
      'Court - Accredited Programme - Building Better Relationships (BBR)'
    ],
    unpaidWork: {
      status: '',
      offered: 12,
      completed: 2,
      appointmentsToDate: 2,
      attended: 2,
      acceptableAbsences: 0,
      unacceptableAbsences: 0
    },
    previousOrderCount: 11,
    previousOrderTitle: 'CJA - Std Determinate Custody',
    previousOrderOffence: 'Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801',
    previousOrderId: '2788607022',
    previousOrderStartDate: '2017-03-08',
    previousOrderEndDate: '2018-01-23',
    previousOrderTerminationReason: 'ICMS Miscellaneous Event',
    offenderManager: 'Mcmahon Buchanan',
    offenderManagerDetails: {
      allocated: '12 Aug 2017',
      address1: 'NPS West Yorkshire',
      address2: 'Ecolight Towers',
      address3: '71 Ocean Parkway',
      address4: 'Leeds',
      address5: 'West Yorkshire',
      postcode: 'LS7 4JP',
      telephone: '01890 547 292'
    }
  },
  dev: {
    caseNo: 1600028955,
    court: '1',
    session: '',
    listing: '1st',
    pnc: '',
    crn: 'X340906',
    name: 'Mr Joe JMBBLOGGS',
    dateOfBirth: '1999-01-01',
    gender: 'Male',
    address: '32 Scotland St Sheffield S3 7BS',
    nationality: 'Unknown',
    offence: 'Theft from a shop',
    offenceDetails: 'On 01/01/2015 at own, stole article, to the value of £987.00, belonging to person.',
    offenceCaption: 'Contrary to section 1(1) and 7 of the Theft Act 1968.',
    currentOrderCount: 1,
    currentOrderTitle: 'ORA Community Order',
    currentOrderOffence: '',
    currentOrderStartDate: '2019-10-01',
    currentOrderEndDate: '2020-05-25',
    currentOrderId: '2500311413',
    currentOrderLastAttendance: '',
    currentOrderAttendance: {
      counts: [],
      headings: [],
      types: []
    },
    previousOrderCount: 0,
    previousOrderTitle: '',
    previousOrderOffence: '',
    previousOrderId: '',
    previousOrderStartDate: '',
    previousOrderEndDate: '',
    previousOrderTerminationReason: '',
    offenderManager: '',
    offenderManagerDetails: {
      allocated: '',
      address1: '',
      address2: '',
      address3: '',
      address4: '',
      address5: '',
      postcode: '',
      telephone: ''
    }
  }
}

module.exports = {
  currentDefendant
}
