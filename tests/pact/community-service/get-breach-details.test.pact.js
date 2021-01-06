/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')

const { request } = require('../../../server/services/utils/request')
const breachMock = require('../../../mappings/community/D991494-breach-12345.json')

pactWith({ consumer: 'prepare_a_case/services/community_service', provider: 'get_breach_details' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/breaches/{breachId}', () => {
    const crn = 'D991494'
    const convictionId = '1361422142'
    const breachId = '12345'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/breaches/${breachId}`
    const mockData = breachMock.response.jsonBody

    const breachRequest = {
      uponReceiving: 'a request for a specific conviction breach details',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const breachResponse = {
      status: breachMock.response.status,
      headers: breachMock.response.headers,
      body: mockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return the specific conviction breach details',
        ...breachRequest,
        willRespondWith: breachResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns the conviction breach details', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
