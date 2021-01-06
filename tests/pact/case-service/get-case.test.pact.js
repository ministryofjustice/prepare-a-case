/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')

const { request } = require('../../../server/services/utils/request')
const caseMock = require('../../../mappings/cases/351196424.json')

pactWith({ consumer: 'prepare_a_case/services/case_service', provider: 'get_case' }, provider => {
  describe('GET /court/{courtCode}/case/{caseNo}', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}`
    const parsedMockData = parseMockResponse(caseMock.response.jsonBody)

    const caseRequest = {
      uponReceiving: 'a request for a specific case',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const caseResponse = {
      status: caseMock.response.status,
      headers: caseMock.response.headers,
      body: parsedMockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return specific case data',
        ...caseRequest,
        willRespondWith: caseResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns a specific case', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
