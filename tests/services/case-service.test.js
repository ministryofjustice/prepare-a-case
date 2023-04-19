/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../config')

const {
  getCaseList,
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
  deleteHearingNoteDraft
} = require('../../server/services/case-service')

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

  it('should invoke API to delete draft', async () => {
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
})
