/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')

const { request } = require('../../../server/services/utils/request')
const sentenceMock = require('../../../mappings/community/DX12340A-sentence-1309234876.json')

pactWith({ consumer: 'prepare_a_case/services/community_service', provider: 'get_sentence_details' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/sentences/{sentenceId}', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const sentenceId = '123123128'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/sentences/${sentenceId}`
    const mockData = sentenceMock.response.jsonBody

    const sentenceRequest = {
      uponReceiving: 'a request for a specific conviction sentence details',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const sentenceResponse = {
      status: sentenceMock.response.status,
      headers: sentenceMock.response.headers,
      body: mockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return the specific conviction sentence details',
        ...sentenceRequest,
        willRespondWith: sentenceResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns the conviction sentence details', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
