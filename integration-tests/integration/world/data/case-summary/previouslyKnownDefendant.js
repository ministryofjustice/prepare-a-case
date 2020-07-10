import moment from 'moment'

const previouslyKnownDefendant = {
  local: {
    caseNo: 6627839278,
    courtName: 'Sheffield Magistrates\' Court',
    court: '8',
    session: 'morning',
    listing: '2nd',
    pnc: 'A/8404713BA',
    crn: 'D541487',
    name: 'Webb Mitchell',
    dateOfBirth: '1958-10-13',
    gender: 'Male',
    address: '49 Rochester Avenue Bangor AD21 5DR',
    nationality: 'Polish',
    offence: 'Theft from the person of another',
    offenceDetails: 'On 24/03/2016 at Edinburgh stole PLAYSTATION 4 to the value of 300.00, belonging to Dillard Everett.',
    offenceCaption: 'Contrary to section 1(1) and 7 of the Theft Act 1968.',
    currentOrderCount: 0,
    currentOrderTitle: '',
    currentOrderId: '',
    previousOrderCount: 5,
    previousOrderTitle: 'CJA - Indeterminate Public Prot.',
    previousOrderOffence: 'Noise offences - 82200',
    previousOrderId: '1531139839',
    previousOrderStartDate: '2018-01-01',
    previousOrderEndDate: '2019-07-12',
    offenderManager: 'Not active',
    offenderManagerDetails: {
      allocated: '',
      address1: '',
      address2: '',
      address3: '',
      address4: '',
      address5: '',
      postcode: '',
      telephone: ''
    },
    preSentenceReportDetails: {
      description: 'Pre-Sentence Report - Fast',
      delivered: `Delivered 1 month ago (${moment().add(-1, 'months').format('D MMM YYYY')})`
    }
  }
}

module.exports = {
  previouslyKnownDefendant
}
