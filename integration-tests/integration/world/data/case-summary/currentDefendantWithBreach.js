import moment from 'moment'

const currentDefendantWithBreach = {
  local: {
    caseNo: 5222601242,
    courtName: 'Sheffield Magistrates\' Court',
    court: '9',
    session: 'morning',
    listing: '1st',
    pnc: 'D/9874483AB',
    crn: 'D991494',
    name: 'Olsen Alexander',
    dateOfBirth: '1996-06-06',
    gender: 'Male',
    address: '99 Ralph Avenue London AD21 5DR',
    nationality: 'British / Swedish',
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
    currentOrderLastAttendance: '10 Mar 2020 - Unpaid work (Acceptable)',
    currentOrderAttendance: {
      counts: [57, 25, 9, 7, 5, 4, 6, 2, 2, 2, 11, 3, 3, 3, 2, 5, 5, 4, 3, 3],
      headings: ['Appointments to date', 'Acceptable', 'Unacceptable', 'Awaiting outcome'],
      types: ['Planned office visit', 'Unpaid work', 'Appointment with External Agency', 'IAPS / Accredited programme']
    },
    breaches: [{
      description: 'Community Order/SSO Breach',
      started: '30 Dec 2014',
      status: 'In progress'
    }, {
      description: 'Community Order/SSO Breach',
      started: '26 Dec 2014',
      status: 'Breach Summons Issued'
    }, {
      description: 'Community Order/SSO Breach',
      started: '26 Nov 2013',
      status: 'Completed - Amended & Continued'
    }],
    breachDetails: {
      order: 'ORA Community Order (12 Months)',
      sentencingCourtName: 'Harrogate Magistrates\' Court',
      incidentDate: '19 Feb 2020',
      started: '22 May 2020',
      provider: 'NPS North East',
      team: 'Enforcement hub - Sheffield and Rotherham',
      officer: 'Unallocated',
      status: 'Breach initiated',
      attachments: {
        documentId: 12346,
        file: 'NAT NPS Breach Report CO SSO_D991494.pdf',
        addedBy: 'Claire Smith',
        dateAdded: '14 Mar 2020'
      }
    },
    unpaidWork: {
      status: 'Terminated - 1 Apr 2020',
      offered: 32,
      completed: 30
    },
    previousOrderCount: 46,
    previousOrderTitle: 'CJA - Std Determinate Custody',
    previousOrderId: '636401162',
    offenderManager: 'Dotson Avila',
    offenderManagerDetails: {
      allocated: 'Allocated on 11 Aug 2016'
    },
    preSentenceReportDetails: {
      description: 'Pre-Sentence Report - Fast',
      delivered: `Delivered less than 1 month ago (${moment().add(-5, 'days').format('D MMM YYYY')})`
    },
    activeCount: 'Active (0)',
    inactiveCount: 'Inactive (0)'
  }
}

module.exports = {
  currentDefendantWithBreach
}
