/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { update } = require('../../../server/services/utils/request')
const caseMock = require('../../../mappings/cases/351196424.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('PUT /court/{courtCode}/case/{caseNo}', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}`
    const parsedMockData = parseMockResponse(caseMock.response.jsonBody)

    it('updates and returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case number',
        uponReceiving: 'a request to update a specific case',
        withRequest: {
          method: 'PUT',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: 201,
          headers: caseMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await update(`${provider.mockService.baseUrl}${apiUrl}`, parsedMockData)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
