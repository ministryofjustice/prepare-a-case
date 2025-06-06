/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../server/config')
const { instance: axios } = require('../../server/routes/middleware/authorisationMiddleware')

const {
  getDetails,
  getSentenceDetails,
  getProbationRecord,
  getProbationStatusDetails,
  getBreachDetails,
  getConviction
} = require('../../server/services/community-service')

const apiUrl = config.apis.courtCaseService.url

describe('Community service', () => {
  beforeEach(() => {
    moxios.install(axios)
  })

  afterEach(() => {
    moxios.uninstall()
    jest.clearAllMocks(axios)
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

  it('should call the api for probation record and handle an unauthorised response', async () => {
    const stubResponse = {
      status: 403,
      response: {
        developerMessage: 'This is the developer message returned',
        errorCode: 0,
        moreInfo: 'This is the more info returned',
        userMessage: 'User message'
      }
    }
    moxios.stubRequest(`${apiUrl}/offender/F378109/probation-record`, stubResponse)
    const actual = await getProbationRecord('F378109')
    return expect(actual.data).toEqual(stubResponse.response)
  })

  it('should call the API to request offender conviction details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/probation-record`, {
      status: 200,
      response: {
        convictions: [{
          convictionId: 12345,
          active: true,
          sentence: {
            description: 'Some sentence'
          }
        }]
      }
    })

    const response = await getProbationRecord('D123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/probation-record`)
    return response
  })

  it('should call the API to request data for a single conviction', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345678`, {
      status: 200,
      response: {
        active: false
      }
    })

    const response = await getConviction('D123456', '12345678')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345678`)
    return response
  })

  it('should call the API to request data for a single conviction', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345`, {
      status: 200,
      response: {
        convictionId: 12345,
        active: true,
        sentence: {
          description: 'Some sentence'
        }
      }
    })

    const response = await getConviction('D123456', '12345')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345`)
    return response
  })

  it('should call the API to request attendance details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345678/sentence`, {
      status: 200,
      response: {
        attendances: []
      }
    })

    const response = await getSentenceDetails('D123456', '12345678')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345678/sentence`)
    return response
  })

  it('should call the API to request breach details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345678/breaches/12345`, {
      status: 200,
      response: {
        conviction: {}
      }
    })

    const response = await getBreachDetails('D123456', '12345678', '12345')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345678/breaches/12345`)
    return response
  })

  it('should call the API to request offender details data', async () => {
    const detailsApiUrl = `${apiUrl}/offender/D123456/detail`
    moxios.stubRequest(detailsApiUrl, {
      status: 200,
      response: {}
    })

    const response = await getDetails('D123456')
    expect(moxios.requests.mostRecent().url).toBe(detailsApiUrl)
    return response
  })

  it('should call the API to request probation status details data', async () => {
    const detailsApiUrl = `${apiUrl}/offender/D123456/probation-status-detail`
    moxios.stubRequest(detailsApiUrl, {
      status: 200,
      response: {}
    })

    const response = await getProbationStatusDetails('D123456')
    expect(moxios.requests.mostRecent().url).toBe(detailsApiUrl)
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
