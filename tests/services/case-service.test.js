/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../config')

const { getCaseList, getCase, getMatchDetails, updateOffender, deleteOffender, addCaseComment, deleteCaseComment, deleteHearingNote } = require('../../server/services/case-service')

const apiUrl = config.apis.courtCaseService.url

describe('Case service', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
    jest.clearAllMocks()
  })

  it('should return http error code in status when API call fails', async () => {
    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01&pageSize=20`, {
      status: 500,
      response: {
      }
    })

    try {
      await getCaseList('SHF', '2020-01-01')
    } catch (e) {
      const response = e.response
      expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01&pageSize=20`)
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

  it('should filter the case list by court room', async () => {
    const filtersObj = { courtRoom: '01' }

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01&courtRoom=01&pageSize=20`, {
      status: 200,
      response: {
        cases: [{
          probationStatus: 'Current',
          courtRoom: '01'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersObj)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01&courtRoom=01&pageSize=20`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should invoke case list API with filters', async () => {
    const filtersObj = { probationStatus: ['Pre-sentence record', 'No record'], courtRoom: ['02', '10'], session: 'MORNING' }

    const caseListApiUrl = `${apiUrl}/court/SHF/cases?date=2020-01-01&probationStatus[]=Pre-sentence+record&probationStatus[]=No+record&courtRoom[]=02&courtRoom[]=10&session=MORNING&page=2&pageSize=20&recentlyAdded=true`
    moxios.stubRequest(caseListApiUrl, {
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

    const response = await getCaseList('SHF', '2020-01-01', filtersObj, 'added', 2)
    expect(moxios.requests.mostRecent().url).toBe(caseListApiUrl)
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
    const endpoint = `${apiUrl}/court/SHF/cases?date=2020-01-01&pageSize=20`
    moxios.stubRequest(endpoint, {
      status: 500
    })

    try {
      await getCaseList('SHF', '2020-01-01')
    } catch (e) {
      const response = e.response
      expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01&pageSize=20`)
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
})
