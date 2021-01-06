/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const caseMock = require('../../../mappings/cases/351196424.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /court/{courtCode}/case/{caseNo}', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}`
    const parsedMockData = parseMockResponse(caseMock.response.jsonBody)

    it('returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case number',
        uponReceiving: 'a request for a specific case',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: caseMock.response.status,
          headers: caseMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
