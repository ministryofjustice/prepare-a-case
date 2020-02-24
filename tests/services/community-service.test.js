/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const { apiUrl } = require('../../config/defaults')

const { getPersonalDetails } = require('../../services/community-service')

describe('Community service', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
    jest.clearAllMocks()
  })

  it('should call the API to request offender personal details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/personal`, {
      status: 200,
      response: {
        data: {}
      }
    })

    const response = await getPersonalDetails('D123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/personal`)
    return response
  })
})
