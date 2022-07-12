/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../config')

const { getCaseList, getCase, getMatchDetails, updateOffender, deleteOffender } = require('../../server/services/case-service')

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

    const response = await getCaseList('SHF', '2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.status).toBe(500)
    expect(response.isError).toBe(true)
    return response
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

    const response = await getCase('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/hearing/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`)
    expect(response.isError).toBe(true)
    expect(response.status).toBe(500)
    return response
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

    const response = await getCaseList('SHF', '2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response).toStrictEqual({
      isError: true,
      status: 500
    })
    return response
  })

  it('should return default 500 error response when API call fails without response status', async () => {
    const endpoint = `${apiUrl}/court/SHF/cases?date=2020-01-01`
    moxios.stubRequest(endpoint, undefined)

    const response = await getCaseList('SHF', '2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response).toStrictEqual({
      isError: true,
      status: 500
    })
    return response
  })
})
