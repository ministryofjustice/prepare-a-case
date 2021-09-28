/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../config')

const { getCaseList, getCase, getMatchDetails, updateCase } = require('../../server/services/case-service')

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

  it('should call the API to request case detail data', async () => {
    moxios.stubRequest(`${apiUrl}/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`, {
      status: 200,
      response: {}
    })

    const response = await getCase('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`)
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
    const endpoint = `${apiUrl}/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/matchesDetail`
    moxios.stubRequest(endpoint, {
      status: 200,
      response: {
        offenderMatchDetails: []
      }
    })

    const response = await getMatchDetails('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })

  it('should call the API to update case details data', async () => {
    const endpoint = `${apiUrl}/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730`
    moxios.stubRequest(endpoint, {
      status: 201
    })

    const response = await updateCase('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730', {})
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })
})
