/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')

const { request } = require('../../../server/services/utils/request')
const defendantDetailsMock = require('../../../mappings/matching/2608860141-detail.json')

pactWith({ consumer: 'prepare_a_case/services/community_service', provider: 'get_defendant_details' }, provider => {
  describe('GET /offender/{crn}/detail', () => {
    const crn = 'D991494'
    const apiUrl = `/offender/${crn}/detail`
    const mockData = defendantDetailsMock.response.jsonBody

    const defendantDetailsRequest = {
      uponReceiving: 'a request for defendant details',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const defendantDetailsResponse = {
      status: defendantDetailsMock.response.status,
      headers: defendantDetailsMock.response.headers,
      body: mockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return the defendant details',
        ...defendantDetailsRequest,
        willRespondWith: defendantDetailsResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns the defendant details', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
