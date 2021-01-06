/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const matchesMock = require('../../../mappings/matching/3597035492-matches.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /court/{courtCode}/case/{caseNo}/matchesDetail', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}/matchesDetail`
    const parsedMockData = parseMockResponse(matchesMock.response.jsonBody)

    it('returns match details', async () => {
      await provider.addInteraction({
        state: 'the defendant has possible matches with existing offender records',
        uponReceiving: 'a request for match details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: matchesMock.response.status,
          headers: matchesMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
