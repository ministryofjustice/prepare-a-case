/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const { apiUrl } = require('../../config/defaults')

const { getCaseList, getCase } = require('../../services/case-service')

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
        data: {
          cases: []
        }
      }
    })

    const response = await getCaseList('SHF', '2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/cases?date=2020-01-01`)
    return response
  })

  it('should call the API to request case detail data', async () => {
    moxios.stubRequest(`${apiUrl}/court/SHF/case/123456`, {
      status: 200,
      response: {
        data: {}
      }
    })

    const response = await getCase('SHF', '123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/court/SHF/case/123456`)
    return response
  })
})
