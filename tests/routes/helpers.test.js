/* global describe, it, expect */
const { getPsrRequestedConvictions, getLastSentencedConvictionPSR } = require('../../server/routes/helpers')

const convictions = [
  {
    active: true,
    awaitingPsr: true,
    offences: [
      {
        description: 'Noise offences - 82200',
        main: false,
        offenceDate: '2021-01-06'
      },
      {
        description: 'Acknowledging bail in false name - 08303',
        main: false,
        offenceDate: '2017-12-06'
      },
      {
        description: 'Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801',
        main: true,
        offenceDate: '2017-11-10'
      },
      {
        description: 'Highways Acts - Other offences, other than those caused by vehicles - 12402',
        main: false,
        offenceDate: '2017-11-01'
      }
    ],
    psrReports: [
      {
        author: {
          forenames: 'Carrie',
          surname: 'Smith',
          unallocated: false
        }
      }
    ],
    requirements: [],
    documents: []
  },
  {
    active: true,
    awaitingPsr: true,
    psrReports: [
      {
        author: {
          forenames: 'Jeff',
          surname: 'Bloggs',
          unallocated: false
        }
      }
    ],
    offences: [
      {
        description: 'Noise offences - 82200',
        main: true,
        offenceDate: '2021-01-06'
      },
      {
        description: 'Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801',
        main: false,
        offenceDate: '2017-11-10'
      },
      {
        description: 'Highways Acts - Other offences, other than those caused by vehicles - 12400',
        main: false,
        offenceDate: '2017-11-01'
      }
    ]
  },
  {
    awaitingPsr: false,
    offences: [
      {
        description: '(Adulteration etc of milk products - 08902)',
        main: true,
        offenceDate: '2018-09-23'
      },
      {
        description: '(Adulteration etc of milk products - 08902)',
        main: false,
        offenceDate: '2018-01-06'
      }
    ],
    documents: [{
      documentId: 'id-four',
      type: 'COURT_REPORT_DOCUMENT', subType: {
        code: 'CJF',
        description: 'Pre-Sentence Report - Fast'
      },
      reportDocumentDates: {
        completedDate: '2018-01-28T00:00:00'
      }
    }]
  },
  {
    active: false,
    offences: [
      {
        description: 'Town and Country Planning Act 1990/Planning (Listed Buildings and Conservation Areas) Act 1990/Planning (Hazardous Substances Act) - 09400',
        main: true,
        offenceDate: '2018-11-14'
      }
    ],
    sentence: { sentenceId: 'sentence-id' },
    documents: [{
        documentId: 'id-one',
        type: 'INSTITUTION_REPORT_DOCUMENT',
        reportDocumentDates: {
          completedDate: '2018-02-28T00:00:00'
        }
      },
      {
        documentId: 'id-two',
        type: 'COURT_REPORT_DOCUMENT',
        reportDocumentDates: {
        }
      },
      {
        documentId: 'id-three',
        type: 'COURT_REPORT_DOCUMENT',
        reportDocumentDates: {
          completedDate: '2018-02-28T00:00:00'
        }
      }]
  }
]
describe('helpers', () => {
  describe('getPsrRequestedConvictions', () => {
    it('Should find convictions with psr requested status and return main offence and psr report details', () => {
      const actual = getPsrRequestedConvictions({convictions})
      expect(actual.length).toBe(2)
      expect(actual).toMatchObject([
        {
          psrReport: {
            author: {
              forenames: 'Carrie',
              surname: 'Smith',
              unallocated: false
            }
          },
          offence: {description: 'Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801'}
        },
        {
          psrReport: {
            author: {
              forenames: 'Jeff',
              surname: 'Bloggs',
              unallocated: false
            }
          },
          offence: {description: 'Noise offences - 82200'}
        }])
    })
  })

  describe('getLastSentencedConvictionPSR', () => {
    it('should return the PSR report details of the last conviction that has a sentence attached', function () {
      expect(getLastSentencedConvictionPSR({convictions})).toStrictEqual({
        documentId: 'id-three',
        type: 'COURT_REPORT_DOCUMENT',
        reportDocumentDates: {
          completedDate: '2018-02-28T00:00:00'
        }
      })
    })
  })
})