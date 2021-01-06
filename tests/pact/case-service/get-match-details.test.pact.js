/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')

const { request } = require('../../../server/services/utils/request')
const matchesMock = require('../../../mappings/matching/3597035492-matches.json')

pactWith({ consumer: 'prepare_a_case/services/case_service', provider: 'get_match_details' }, provider => {
  describe('GET /court/{courtCode}/case/{caseNo}/matchesDetail', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}/matchesDetail`
    const parsedMockData = parseMockResponse(matchesMock.response.jsonBody)

    const matchesRequest = {
      uponReceiving: 'a request for match details',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const matchesResponse = {
      status: matchesMock.response.status,
      headers: matchesMock.response.headers,
      body: parsedMockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return match details data',
        ...matchesRequest,
        willRespondWith: matchesResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns match details', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
