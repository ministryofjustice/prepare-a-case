/* global describe, beforeEach, afterEach, it, expect, jest, test */
const moxios = require('moxios')
const config = require('../../config')

const {
  getCaseList,
  getPagedCaseList,
  getOutcomesList,
  getCase,
  getMatchDetails,
  updateOffender,
  deleteOffender,
  addCaseComment,
  deleteCaseComment,
  deleteHearingNote,
  saveDraftHearingNote,
  updateHearingNote,
  searchCases,
  deleteHearingNoteDraft,
  addHearingOutcome,
  deleteCaseCommentDraft,
  updateHearingOutcomeToResulted
} = require('../../server/services/case-service')
const getOutcomeTypesListFilters = require('../../server/utils/getOutcomeTypesListFilters')
const getOutcomeListSorts = require('../../server/utils/getOutcomesSorts')

const apiUrl = config.apis.courtCaseService.url

describe('Case service', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
    jest.clearAllMocks()
  })

  it('should call the API to request case list data', async () => {
    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: []
      }
    })

    const response = await getCaseList('SHF', '2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    return response
  })

  it('should return http error code in status when API call fails', async () => {
    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 500,
      response: {
      }
    })

    try {
      await getCaseList('SHF', '2020-01-01')
    } catch (e) {
      const response = e.response
      expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
      expect(response.status).toBe(500)
      return response
    }
  })

  it('should call the API to request case detail data', async () => {
    moxios.stubRequest(`${apiUrl}/hearing/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`, {
      status: 200,
      response: {}
    })

    const response = await getCase('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/hearing/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`)
    return response
  })

  it('should return error code when API call to request case data failed', async () => {
    moxios.stubRequest(`${apiUrl}/hearing/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`, {
      status: 500,
      response: {}
    })

    try {
      await getCase('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    } catch (e) {
      const response = e.response
      expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/hearing/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`)
      expect(response.status).toBe(500)
      return response
    }
  })

  it('should filter the case list by probation status', async () => {
    const filtersObj = { probationStatus: 'Current' }

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: [{
          probationStatus: 'Current'
        }, {
          probationStatus: 'No record'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersObj)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should filter the case list by court room', async () => {
    const filtersObj = { courtRoom: '01' }

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: [{
          probationStatus: 'Current',
          courtRoom: '01'
        }, {
          probationStatus: 'Current',
          courtRoom: '02'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersObj)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should filter the case list by court room ignoring 0 prefix', async () => {
    const filtersObj = { courtRoom: '01' }

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: [{
          probationStatus: 'Current',
          courtRoom: '01'
        }, {
          probationStatus: 'Current',
          courtRoom: '02'
        }, {
          probationStatus: 'Current',
          courtRoom: '1'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersObj)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(2)
    return response
  })

  it('should filter the case list by session', async () => {
    const filtersObj = { session: 'MORNING' }

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: [{
          probationStatus: 'Current',
          session: 'MORNING'
        }, {
          probationStatus: 'Current',
          session: 'AFTERNOON'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersObj)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should call the API to request match details data', async () => {
    const endpoint = `${apiUrl}/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/matchesDetail`
    moxios.stubRequest(endpoint, {
      status: 200,
      response: {
        offenderMatchDetails: []
      }
    })

    const response = await getMatchDetails('2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })

  it('should call the API to update offender data', async () => {
    const endpoint = `${apiUrl}/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/offender`
    moxios.stubRequest(endpoint, {
      status: 200
    })

    const offenderData = { yond: 'offender data' }
    const response = await updateOffender('2e0afeb7-95d2-42f4-80e6-ccf96b282730', offenderData)
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    expect(moxios.requests.mostRecent().config.data).toBe(JSON.stringify(offenderData))
    return response
  })

  it('should call the API to delete offender data', async () => {
    const endpoint = `${apiUrl}/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/offender`
    moxios.stubRequest(endpoint, {
      status: 200
    })

    const response = await deleteOffender('2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })

  it('should return error response when API call to get case list fails with 500 status', async () => {
    const endpoint = `${apiUrl}/court/SHF/cases?date=2020-01-01`
    moxios.stubRequest(endpoint, {
      status: 500
    })

    try {
      await getCaseList('SHF', '2020-01-01')
    } catch (e) {
      const response = e.response
      expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
      expect(response.status).toBe(500)
      return response
    }
  })

  it('should call the API to create comment', async () => {
    const endpoint = `${apiUrl}/cases/2e0afeb7-95d2-42f4-80e6-ccf96b282730/comments`
    moxios.stubRequest(endpoint, {
      status: 201
    })

    const caseId = '2e0afeb7-95d2-42f4-80e6-ccf96b282730'
    const comment = 'A comment'
    const author = 'Adam Sandler'
    const response = await addCaseComment(caseId, comment, author)
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    expect(moxios.requests.mostRecent().config.data).toBe(JSON.stringify({ caseId, comment, author }))
    return response
  })

  it('should call the API to delete a comment', async () => {
    const endpoint = `${apiUrl}/cases/2e0afeb7-95d2-42f4-80e6-ccf96b282730/comments/12345`
    moxios.stubRequest(endpoint, {
      status: 200
    })

    const caseId = '2e0afeb7-95d2-42f4-80e6-ccf96b282730'
    const commentId = 12345
    const response = await deleteCaseComment(caseId, commentId)
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })

  it('should call the API to delete a hearing note', async () => {
    const endpoint = `${apiUrl}/hearing/2e0afeb7-95d2-42f4-80e6-ccf96b282730/notes/12345`
    moxios.stubRequest(endpoint, {
      status: 200
    })

    const hearingId = '2e0afeb7-95d2-42f4-80e6-ccf96b282730'
    const noteId = 12345
    const response = await deleteHearingNote(hearingId, noteId)
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })

  it('should call the API to save draft hearing note', async () => {
    const endpoint = `${apiUrl}/hearing/2e0afeb7-95d2-42f4-80e6-ccf96b282730/notes/draft`
    moxios.stubRequest(endpoint, {
      status: 200
    })

    const hearingId = '2e0afeb7-95d2-42f4-80e6-ccf96b282730'
    const note = 'note'
    const author = 'Author'
    const response = await saveDraftHearingNote(hearingId, note, author)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    expect(mostRecent.config.data).toBe(JSON.stringify({ hearingId, note, author }))
    return response
  })

  it('should call the API to update hearing note', async () => {
    const noteId = 123
    const endpoint = `${apiUrl}/hearing/2e0afeb7-95d2-42f4-80e6-ccf96b282730/notes/${noteId}`
    moxios.stubRequest(endpoint, {
      status: 200
    })

    const hearingId = '2e0afeb7-95d2-42f4-80e6-ccf96b282730'
    const note = 'note'
    const author = 'Author'
    const response = await updateHearingNote(hearingId, note, noteId, author)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    expect(mostRecent.config.data).toBe(JSON.stringify({ hearingId, note, author, noteId }))
    return response
  })

  it('should call the API to search by term and type', async () => {
    const term = 'C123'
    const type = 'CRN'
    const endpoint = `${apiUrl}/search?term=${term}&type=${type}`
    const data = {
      items: [{
        hearingId: '5b9c8c1d-e552-494e-bc90-d475740c64d8',
        defendantId: '8597a10b-d330-43e5-80c3-27ce3b46979f'
      }]
    }
    moxios.stubRequest(endpoint, {
      status: 200,
      response: data
    })

    const response = await searchCases(term, 'CRN')
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    expect(response.data).toBe(data)
    return response
  })

  it('should call the API to search by CRN and return empty data on 404', async () => {
    const term = 'C123'
    const endpoint = `${apiUrl}/search?term=${term}`
    moxios.stubRequest(endpoint, {
      status: 404
    })

    const response = await searchCases(term)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    expect(response.data).toStrictEqual({})
    return response
  })

  it('should ignore 404 from the API call to delete draft', async () => {
    const hearingId = 'id-one'
    const endpoint = `${apiUrl}/hearing/${hearingId}/notes/draft`
    moxios.stubRequest(endpoint, {
      status: 404
    })

    const response = await deleteHearingNoteDraft(hearingId)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    return response
  })

  it('should throw non 404 from the API call to delete draft', async () => {
    const hearingId = 'id-one'
    const endpoint = `${apiUrl}/hearing/${hearingId}/notes/draft`
    moxios.stubRequest(endpoint, {
      status: 401
    })

    const response = await expect(async () => await deleteHearingNoteDraft(hearingId)).rejects.toThrow('Request failed with status code 401')
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    return response
  })

  it('should invoke API to delete hearing note draft for given hearing', async () => {
    const hearingId = 'id-one'
    const endpoint = `${apiUrl}/hearing/${hearingId}/notes/draft`
    moxios.stubRequest(endpoint, {
      status: 200
    })
    const response = await deleteHearingNoteDraft(hearingId)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    return response
  })

  it('should invoke API to delete case comment draft for a given case', async () => {
    const caseId = 'id-one'
    const endpoint = `${apiUrl}/cases/${caseId}/comments/draft`
    moxios.stubRequest(endpoint, {
      status: 200
    })
    const response = await deleteCaseCommentDraft(caseId)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    return response
  })

  it('should ignore 404 from API to delete case comment draft', async () => {
    const caseId = 'id-one'
    const endpoint = `${apiUrl}/cases/${caseId}/comments/draft`
    moxios.stubRequest(endpoint, {
      status: 404
    })
    const response = await deleteCaseCommentDraft(caseId)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    return response
  })

  it('should throw non 404 from the API call to delete draft comment', async () => {
    const caseId = 'id-one'
    const endpoint = `${apiUrl}/cases/${caseId}/comments/draft`
    moxios.stubRequest(endpoint, {
      status: 401
    })

    const response = await expect(async () => await deleteCaseCommentDraft(caseId)).rejects.toThrow('Request failed with status code 401')
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    return response
  })

  it('should invoke API to add hearing outcome', async () => {
    const hearingId = 'id-one'
    const endpoint = `${apiUrl}/hearing/${hearingId}/outcome`
    moxios.stubRequest(endpoint, {
      status: 200
    })
    const hearingOutcomeType = 'REPORT_REQUESTED'
    const response = await addHearingOutcome(hearingId, hearingOutcomeType)
    const mostRecent = moxios.requests.mostRecent()
    expect(mostRecent.url).toBe(endpoint)
    expect(mostRecent.config.data).toBe(JSON.stringify({ hearingOutcomeType }))
    return response
  })

  describe('getOutcomesList', () => {
    const state = 'NEW'
    const courtCode = 'SHF'
    const expected1 = `${apiUrl}/courts/${courtCode}/hearing-outcomes?state=${state}`
    const expected2 = `${apiUrl}/courts/${courtCode}/hearing-outcomes?state=${state}&outcomeType=ADJOURNED`
    const expected3 = `${apiUrl}/courts/${courtCode}/hearing-outcomes?state=${state}&sortBy=hearingDate&order=DESC`
    const expected4 = `${apiUrl}/courts/${courtCode}/hearing-outcomes?state=${state}&outcomeType=ADJOURNED&sortBy=hearingDate&order=ASC`
    const expected5 = `${apiUrl}/courts/${courtCode}/hearing-outcomes?state=${state}&outcomeType=REPORT_REQUESTED&sortBy=hearingDate&order=DESC`
    const expected6 = `${apiUrl}/courts/${courtCode}/hearing-outcomes?state=${state}&outcomeType=REPORT_REQUESTED&outcomeType=ADJOURNED&sortBy=hearingDate&order=DESC`

    test.each`
      courtCode    |  filters | sorts | state   | expected
      ${courtCode} | ${null} | ${null} | '${state}' | ${expected1}
      ${courtCode} | ${getOutcomeTypesListFilters({ outcomeType: ['ADJOURNED'] })} | ${null} | '${state}' | ${expected2}
      ${courtCode} | ${null} | ${getOutcomeListSorts({ hearingDate: 'DESC' })} | '${state}' | ${expected3}
      ${courtCode} | ${getOutcomeTypesListFilters({ outcomeType: ['ADJOURNED'] })} | ${getOutcomeListSorts({ hearingDate: 'ASC' })} | '${state}' | ${expected4}
      ${courtCode} | ${getOutcomeTypesListFilters({ outcomeType: ['REPORT_REQUESTED'] })} | ${getOutcomeListSorts({ hearingDate: 'DESC' })} | '${state}' | ${expected5}
      ${courtCode} | ${getOutcomeTypesListFilters({ outcomeType: ['REPORT_REQUESTED', 'ADJOURNED'] })} | ${getOutcomeListSorts({ hearingDate: 'DESC' })} | '${state}' | ${expected6}
      ${courtCode} | ${getOutcomeTypesListFilters({ outcomeTypeUnknown: ['REPORT_REQUESTED'] })} | ${getOutcomeListSorts({ hearingDateUnknown: 'DESC' })} | '${state}' | ${expected1}
    `('calls API with $expected when getOutcomesList($courtCode, $filters, $sorts, $state)', async ({
      courtCode,
      filters,
      sorts,
      state,
      expected
    }) => {
      moxios.stubRequest(expected, {
        status: 200,
        response: {
          cases: []
        }
      })
      const response = await getOutcomesList(courtCode, filters, sorts, state)
      expect(moxios.requests.mostRecent().url).toBe(expected)
      return response
    })
    it('should return http error code in status when API call fails', async () => {
      moxios.stubRequest(`${apiUrl}/courts/SHF/hearing-outcomes?state=NEW`, {
        status: 500,
        response: { isError: true, status: 500 }
      })

      try {
        await getOutcomesList('SHF', [], [], 'NEW')
      } catch (e) {
        const response = e.response
        expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/courts/SHF/hearing-outcomes?state=NEW`)
        expect(response.status).toBe(500)
        expect(response.data.isError).toBe(true)
        return response
      }
    })
  })
  describe('server side paging', () => {
    it('should invoke api url correctly', async () => {
      const expectedUrl = `${apiUrl}/court/SHF/cases?date=2020-01-01&VERSION2=true&page=1&limit=20&probationStatus=CURRENT&probationStatus=NO_RECORD&courtRoom=01&courtRoom=Courtroom+01&courtRoom=Crown+court+1-3&courtRoom=02&source=COMMON_PLATFORM&session=MORNING&breach=true`
      moxios.stubRequest(expectedUrl, {
        status: 200,
        response: {
          cases: [],
          possibleMatchesCount: 2,
          recentlyAddedCount: 5,
          courtRoomFilters: ['07', '01', 'Crown court 5-6', '08', 'Courtroom 01', '02', 'Crown court 1-3'],
          page: 1,
          totalPages: 2,
          totalElements: 130
        }
      })

      const selectedFilters = {
        probationStatus: ['CURRENT', 'NO_RECORD'],
        courtRoom: ['01,Courtroom 01', 'Crown court 1-3', '02'],
        source: 'COMMON_PLATFORM',
        session: 'MORNING',
        breach: true
      }

      // (courtCode, date, selectedFilters, subsection, page, limit)
      const resp = await getPagedCaseList('SHF', '2020-01-01', selectedFilters, undefined, 1, 20)
      expect(moxios.requests.mostRecent().url).toBe(expectedUrl)
      expect(resp.filters[1]).toStrictEqual({
        id: 'courtRoom',
        label: 'Courtroom',
        items: [
          { label: '1', value: ['01', 'Courtroom 01'], checked: true },
          { label: '2', value: ['02'], checked: true },
          { label: '7', value: ['07'], checked: false },
          { label: '8', value: ['08'], checked: false },
          { label: 'Crown court 1-3', value: 'Crown court 1-3', checked: true },
          { label: 'Crown court 5-6', value: 'Crown court 5-6', checked: false }
        ]
      })
    })
  })

  describe('updateHearingOutcomeToResulted', () => {
    it('given hearing id, when updateHearingOutcomeToResulted is invoked, should invoke api correctly', async () => {
      const hearingId = 'test-hearing-id'
      const expectedUrl = `${apiUrl}/hearing/${hearingId}/outcome/result`
      moxios.stubRequest(expectedUrl, {
        status: 200
      })

      await updateHearingOutcomeToResulted(hearingId)
      expect(moxios.requests.mostRecent().url).toBe(expectedUrl)
    })
  })
})
