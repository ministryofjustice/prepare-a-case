const currentDefendantWithBreach = {
  local: {
    caseNo: 5222601242,
    court: '9',
    session: 'morning',
    listing: '1st',
    pnc: 'D/9874483AB',
    crn: 'D991494',
    name: 'Olsen Alexander',
    dateOfBirth: '1996-06-06',
    gender: 'Male',
    address: '99 Ralph Avenue London AD21 5DR',
    nationality: 'Unknown',
    offence: 'Theft from a shop',
    offenceDetails: 'On 01/01/2015 at Tetratrex, Leeds, stole ROBOTS to the value of £987.00, belonging to Young Bryant.',
    offenceCaption: 'Contrary to section 1(1) and 7 of the Theft Act 1968.',
    currentOrderCount: 7,
    currentOrderBreach: true,
    currentOrderTitle: 'ORA Community Order',
    currentOrderOffence: 'Abstracting electricity - 04300',
    currentOrderStartDate: '2018-10-07',
    currentOrderEndDate: '2020-06-17',
    currentOrderId: '1361422142',
    currentOrderLastAttendance: '10 Mar 2020 - Unpaid work (Attended - Complied)',
    currentOrderAttendance: {
      counts: [57, 25, 9, 7, 5, 4, 6, 2, 2, 2, 11, 3, 3, 3, 2, 5, 2, 1, 1, 1, 1],
      headings: ['Appointments to date', 'Complied', 'Failures to comply', 'Awaiting outcome'],
      types: ['Planned office visit', 'Unpaid work', 'Appointment with External Agency', 'IAPS / Accredited programme']
    },
    breaches: [{
      description: 'Community Order/SSO Breach',
      started: '30 Dec 2014',
      status: 'In progress'
    }, {
      description: 'Community Order/SSO Breach',
      started: '26 Nov 2013',
      status: 'Completed - Amended & Continued'
    }],
    breachDetails: {
      conviction: 'ORA Community Order (12 Months)',
      court: 'Harrogate Magistrates\' Court',
      incidentDate: '19 Feb 2020',
      started: '22 May 2020',
      provider: 'NPS North East',
      team: 'Enforcement hub - Sheffield and Rotherham',
      officer: 'Unallocated',
      status: 'Breach initiated'
    },
    unpaidWork: {
      status: 'Terminated - 1 Apr 2020',
      offered: 32,
      completed: 30
    },
    previousOrderCount: 46,
    previousOrderTitle: 'CJA - Std Determinate Custody',
    previousOrderId: '2363215335',
    offenderManager: 'Dotson Avila',
    offenderManagerDetails: {
      allocated: 'Allocated on 11 Aug 2016',
      address1: 'NPS Gwynedd',
      address2: 'Deepends Buildings',
      address3: '31 Montana Place',
      address4: 'Bangor',
      address5: 'Gwynedd',
      postcode: 'LL6 3CV',
      telephone: '01895 540 370'
    }
  },
  dev: {
    caseNo: 0,
    court: '0',
    session: '',
    listing: '',
    pnc: '',
    crn: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    nationality: '',
    offence: '',
    offenceDetails: '',
    offenceCaption: '',
    currentOrderCount: 0,
    currentOrderTitle: '',
    currentOrderId: '',
    previousOrderCount: 0,
    previousOrderTitle: '',
    previousOrderId: '',
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
  currentDefendantWithBreach
}
