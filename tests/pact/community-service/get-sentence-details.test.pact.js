/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const sentenceMock = require('../../../mappings/community/DX12340A-sentence-1309234876.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/sentences/{sentenceId}', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const sentenceId = '123123128'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/sentences/${sentenceId}`
    const mockData = sentenceMock.response.jsonBody

    it('returns the conviction sentence details', async () => {
      await provider.addInteraction({
        state: 'the defendant has an existing conviction',
        uponReceiving: 'a request for a specific conviction sentence details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: sentenceMock.response.status,
          headers: sentenceMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
