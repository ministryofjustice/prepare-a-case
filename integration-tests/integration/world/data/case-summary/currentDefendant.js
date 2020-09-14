const currentDefendant = {
  local: {
    caseNo: 668911253,
    courtName: 'Sheffield Magistrates\' Court',
    court: '6',
    session: 'morning',
    listing: '2nd',
    pnc: 'A/1234560BA',
    crn: 'DX12340A',
    name: 'Lenore Marquez',
    dateOfBirth: '1979-08-18',
    gender: 'Female',
    address: '38 Clarendon Road Glasgow AD21 5DR',
    nationality: 'British',
    offence: 'Attempt theft from the person of another',
    offenceDetails: 'On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron.',
    offenceCaption: 'Contrary to section 1(1) of the Criminal Attempts Act 1981.',
    currentOrderCount: 3,
    currentOrderTitle: 'ORA Community Order',
    currentOrderOffence: 'Stealing mail bags or postal packets or unlawfully taking away or opening mail bag - 04200',
    currentOrderStartDate: '2019-05-20',
    currentOrderEndDate: '2020-05-25',
    currentOrderId: '1403337513',
    currentOrderLastAttendance: '4 Mar 2020 - Planned office visit (Acceptable)',
    currentOrderAttendance: {
      counts: [10, 6, 2, 2, 1, 1, 0, 1, 1, 3, 3],
      headings: ['Appointments to date', 'Acceptable', 'Unacceptable'],
      types: ['Planned office visit', 'Unpaid work', 'Appointment with External Agency', 'IAPS / Accredited programme']
    },
    currentOrderRequirements: [
      'Unpaid Work (Regular) - 60 Hours',
      'Rehabilitation Activity Requirement (RAR) - 20 Days',
      'Court - Accredited Programme (ASRO)',
      'Court - Accredited Programme - Building Better Relationships (BBR)'
    ],
    unpaidWork: {
      status: 'Terminated - 23 Jan 2018',
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
    previousOrderId: '636401162',
    previousOrderStartDate: '2017-03-08',
    previousOrderEndDate: '2018-01-23',
    previousOrderTerminationReason: 'ICMS Miscellaneous Event',
    offenderManager: 'Mcmahon Buchanan',
    offenderManagerDetails: {
      allocated: '12 Aug 2017'
    },
    preSentenceReportDetails: {
      description: 'Pre-Sentence Report - Fast',
      delivered: 'Delivered more than 6 months ago'
    },
    oasysAssessmentDetails: {
      type: 'Layer 3',
      completed: '20 Jun 2018'
    },
    onLicence: {
      orderId: '1309234876',
      status: 'On licence',
      start: '-6 months',
      end: '6 months'
    },
    onPss: {
      orderId: '2360414697',
      status: 'On post-sentence supervision (PSS)',
      start: 'today',
      end: '5 months'
    }
  }
}

module.exports = {
  currentDefendant
}
