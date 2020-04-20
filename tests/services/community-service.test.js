/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const { apiUrl } = require('../../config/defaults')

const { getPersonalDetails, getProbationRecord, getAttendanceDetails } = require('../../services/community-service')

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
      response: {}
    })

    const response = await getPersonalDetails('D123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/personal`)
    return response
  })

  it('should call the API to request offender conviction details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/probation-record`, {
      status: 200,
      response: {
        convictions: [{
          active: false
        }]
      }
    })

    const response = await getProbationRecord('D123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/probation-record`)
    return response
  })

  it('should call the API to request order requirements data if the conviction is active', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/probation-record`, {
      status: 200,
      response: {
        convictions: [{
          active: true,
          convictionId: 1234567890,
          sentence: 'some sentence data'
        }]
      }
    })

    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/1234567890/requirements`, {
      status: 200,
      response: {
        requirements: [{}]
      }
    })

    const response = await getProbationRecord('D123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/1234567890/requirements`)
    return response
  })

  it('should call the API to request attendance details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345678`, {
      status: 200,
      response: {
        attendances: []
      }
    })

    const response = await getAttendanceDetails('D123456', '12345678')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345678`)
    return response
  })

  it('should fail silently', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/probation-record`, {
      status: 500,
      response: {}
    })
    expect(async () => {
      await getProbationRecord('D123456')
    }).not.toThrow()
  })
})
