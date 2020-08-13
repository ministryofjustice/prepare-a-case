/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../config')

const { getCaseList, getCase, getMatchDetails } = require('../../server/services/case-service')

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
    moxios.stubRequest(`${apiUrl}/court/SHF/case/123456`, {
      status: 200,
      response: {}
    })

    const response = await getCase('SHF', '123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/case/123456`)
    return response
  })

  it('should filter the case list by probation status', async () => {
    const filtersArr = [{
      id: 'probationStatus',
      label: 'Probation status',
      items: [{
        label: 'Current',
        value: 'Current',
        checked: true
      }]
    }]

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

    const response = await getCaseList('SHF', '2020-01-01', filtersArr)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should filter the case list by court room', async () => {
    const filtersArr = [{
      id: 'courtRoom',
      label: 'Courtroom',
      items: [{
        label: '1',
        value: '1',
        checked: true
      }]
    }]

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: [{
          courtRoom: '1'
        }, {
          courtRoom: '2'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersArr)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should filter the case list by session', async () => {
    const filtersArr = [{
      id: 'session',
      label: 'Session',
      items: [{
        label: 'Morning',
        value: 'MORNING',
        checked: true
      }]
    }]

    moxios.stubRequest(`${apiUrl}/court/SHF/cases?date=2020-01-01`, {
      status: 200,
      response: {
        cases: [{
          session: 'MORNING'
        }, {
          session: 'AFTERNOON'
        }]
      }
    })

    const response = await getCaseList('SHF', '2020-01-01', filtersArr)
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    expect(response.cases.length).toEqual(1)
    return response
  })

  it('should call the API to request match details data', async () => {
    const endpoint = `${apiUrl}/court/SHF/case/3597035492/matchesDetail`
    moxios.stubRequest(endpoint, {
      status: 200,
      response: {
        offenderMatchDetails: []
      }
    })

    const response = await getMatchDetails('SHF', '3597035492')
    expect(moxios.requests.mostRecent().url).toBe(endpoint)
    return response
  })
})
