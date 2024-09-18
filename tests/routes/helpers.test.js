/* global describe, it, expect */
const {
  getPsrRequestedConvictions,
  getNormalisedCourtRoom,
  prepareCourtRoomFilters,
  getLastSentencedConvictionPSR, getOrderTitle,
  getPaginationObject
} = require('../../server/routes/helpers')

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
      type: 'COURT_REPORT_DOCUMENT',
      subType: {
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
      reportDocumentDates: {}
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
  describe('getOrderTitle', () => {
    it('should render a title including the sentence description and length', () => {
      const communityResponse = {
        sentence: {
          description: 'ORA Community Order',
          length: 4,
          lengthUnits: 'Months'
        }
      }
      const result = getOrderTitle(communityResponse)
      expect(result).toBe('ORA Community Order (4 Months)')
    })

    it('should render a title when no sentence length is available', () => {
      const communityResponse = {
        sentence: {
          description: 'ORA Community Order'
        }
      }
      const result = getOrderTitle(communityResponse)

      expect(result).toBe('ORA Community Order')
    })
  })

  describe('getPsrRequestedConvictions', () => {
    it('Should find convictions with psr requested status and return main offence and psr report details', () => {
      const actual = getPsrRequestedConvictions({ convictions })
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
          offence: { description: 'Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801' }
        },
        {
          psrReport: {
            author: {
              forenames: 'Jeff',
              surname: 'Bloggs',
              unallocated: false
            }
          },
          offence: { description: 'Noise offences - 82200' }
        }])
    })
  })

  describe('getLastSentencedConvictionPSR', () => {
    it('should return the PSR report details of the last conviction that has a sentence attached', function () {
      expect(getLastSentencedConvictionPSR({ convictions })).toStrictEqual({
        documentId: 'id-three',
        type: 'COURT_REPORT_DOCUMENT',
        reportDocumentDates: {
          completedDate: '2018-02-28T00:00:00'
        }
      })
    })
  })

  describe('getCourtRoomLabel', () => {
    it.each([
      ['1', '1'],
      ['01', '1'],
      ['010', '10'],
      ['10', '10'],
      ['Courtroom 060', '60'],
      ['Courtroom 01', '1'],
      ['Courtroom 17', '17'],
      ['02-3', '2-3'],
      ['Crown Court 3-1', 'Crown Court 3-1']
    ])('given court room %s, should return court room label %s', (courtRoom, expectedLabel) => {
      expect(getNormalisedCourtRoom(courtRoom)).toEqual(expectedLabel)
    })
  })

  describe('prepareCourtRoomFilters', () => {
    it.each([
      [
        ['01', '05', '03', '08', '01', '05', '03', '08'],
        [{ label: '1', value: ['01'] }, { label: '3', value: ['03'] }, { label: '5', value: ['05'] }, { label: '8', value: ['08'] }]
      ],
      [
        ['Courtroom 01', '05', '03', '08', '01', 'Courtroom 05', 'Crown Court 5-6', 'Crown Court 5-6', 'Crown Court 3-1', '03', '08'],
        [{ label: '1', value: ['Courtroom 01', '01'] }, { label: '3', value: ['03'] }, { label: '5', value: ['05', 'Courtroom 05'] }, { label: '8', value: ['08'] }, { label: 'Crown Court 3-1', value: 'Crown Court 3-1' }, { label: 'Crown Court 5-6', value: 'Crown Court 5-6' }]
      ],
      [
        ['Crown Court 5-6', '01', '05', '03', '08', 'Crown Court 3-1', 'Crown Court 5-6', '01', '05', '03', '08'],
        [{ label: '1', value: ['01'] }, { label: '3', value: ['03'] }, { label: '5', value: ['05'] }, { label: '8', value: ['08'] }, { label: 'Crown Court 3-1', value: 'Crown Court 3-1' }, { label: 'Crown Court 5-6', value: 'Crown Court 5-6' }]
      ]
    ])('given court room list %s, should return court room filters %s', (courtRooms, expected) => {
      const actual = prepareCourtRoomFilters(courtRooms)
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('getPaginationObject', () => {
    describe('getPaginationObject', () => {
      it('should calculate pagination with all default values', () => {
        const pageParams = {
          page: 1,
          matchingRecordsCount: 20,
          limit: 5,
          courtCode: 'COURT01',
          caseId: 'CASE123',
          hearingId: 'HEARING123',
          defendantId: 'DEFENDANT123'
        }
        const result = getPaginationObject(pageParams)

        expect(result).toMatchObject({
          maxPagesDisplay: 4,
          currentPage: 1,
          startNum: 1,
          endNum: 4,
          totalPages: 4,
          from: 0,
          to: 5,
          matchingRecordsCount: 20,
          pageItems: [
            { text: 1, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=1', selected: true },
            { text: 2, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=2', selected: false },
            { text: 3, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=3', selected: false },
            { text: 4, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=4', selected: false }
          ],
          previousLink: undefined,
          nextLink: {
            text: 'Next',
            href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=2'
          }
        })
      })

      it('should handle cases where total pages are less than maximumPages', () => {
        const pageParams = {
          page: 1,
          matchingRecordsCount: 8,
          limit: 5,
          courtCode: 'COURT01',
          caseId: 'CASE123',
          hearingId: 'HEARING123',
          defendantId: 'DEFENDANT123'
        }
        const result = getPaginationObject(pageParams)

        expect(result).toMatchObject({
          maxPagesDisplay: 4,
          currentPage: 1,
          startNum: 1,
          endNum: 2,
          totalPages: 2,
          from: 0,
          to: 5,
          matchingRecordsCount: 8,
          pageItems: [
            { text: 1, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=1', selected: true },
            { text: 2, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=2', selected: false }
          ],
          previousLink: undefined,
          nextLink: {
            text: 'Next',
            href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=2'
          }
        })
      })

      it('should handle pages beyond total pages', () => {
        const pageParams = {
          page: 5,
          matchingRecordsCount: 20,
          limit: 5,
          courtCode: 'COURT01',
          caseId: 'CASE123',
          hearingId: 'HEARING123',
          defendantId: 'DEFENDANT123'
        }
        const result = getPaginationObject(pageParams)

        expect(result).toMatchObject({
          maxPagesDisplay: 4,
          currentPage: 5,
          startNum: 1,
          endNum: 4,
          totalPages: 4,
          from: 20,
          to: 20,
          matchingRecordsCount: 20,
          pageItems: [
            { text: 1, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=1', selected: false },
            { text: 2, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=2', selected: false },
            { text: 3, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=3', selected: false },
            { text: 4, href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=4', selected: false }
          ],
          previousLink: {
            text: 'Previous',
            href: '/COURT01/case/CASE123/hearing/HEARING123/match/defendant/DEFENDANT123?page=4'
          },
          nextLink: undefined
        })
      })
    })
  })
})
