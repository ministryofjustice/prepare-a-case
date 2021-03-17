/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const config = require('../../config')

const {
  getDetails,
  getSentenceDetails,
  getProbationRecord,
  getProbationRecordWithRequirements,
  getProbationStatusDetails,
  getBreachDetails
} = require('../../server/services/community-service')

const apiUrl = config.apis.courtCaseService.url

describe('Community service', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
    jest.clearAllMocks()
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
    moxios.stubRequest(`${apiUrl}/offender/F378109/probation-record`, {
      status: 403,
      response: {
        developerMessage: 'This is the developer message returned',
        errorCode: 0,
        moreInfo: 'This is the more info returned',
        userMessage: 'User message'
      }
    })

    const response = await getProbationRecord('F378109')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/F378109/probation-record`)
    expect(response.status).toBe(403)
    expect(response.data.userMessage).toBe('User message')
    return response
  })

  it('should call the API to request offender conviction details data with requirements', async () => {
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

    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345/requirements`, {
      status: 200,
      response: {
        requirements: [{
          requirementId: 7925250000
        }]
      }
    })

    const response = await getProbationRecordWithRequirements('D123456')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345/requirements`)
    return response
  })

  it('should call the API to request attendance details data', async () => {
    moxios.stubRequest(`${apiUrl}/offender/D123456/convictions/12345678/sentences/987654321`, {
      status: 200,
      response: {
        attendances: []
      }
    })

    const response = await getSentenceDetails('D123456', '12345678', '987654321')
    expect(moxios.requests.mostRecent().url).toBe(`${apiUrl}/offender/D123456/convictions/12345678/sentences/987654321`)
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
