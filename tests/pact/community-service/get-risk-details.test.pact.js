/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')

const { request } = require('../../../server/services/utils/request')
const riskDetailsMock = require('../../../mappings/community/D541487-registrations.json')

pactWith({ consumer: 'prepare_a_case/services/community_service', provider: 'get_risk_details' }, provider => {
  describe('GET /offender/{crn}/registrations', () => {
    const crn = 'D541487'
    const apiUrl = `/offender/${crn}/registrations`
    const mockData = riskDetailsMock.response.jsonBody

    const riskDetailsRequest = {
      uponReceiving: 'a request for defendant risk details',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const riskDetailsResponse = {
      status: riskDetailsMock.response.status,
      headers: riskDetailsMock.response.headers,
      body: mockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return the defendant risk details',
        ...riskDetailsRequest,
        willRespondWith: riskDetailsResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns the defendant risk details', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
