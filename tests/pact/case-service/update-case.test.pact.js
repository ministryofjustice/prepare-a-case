/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')

const { update } = require('../../../server/services/utils/request')
const caseMock = require('../../../mappings/cases/351196424.json')

pactWith({ consumer: 'prepare_a_case/services/case_service', provider: 'update_case' }, provider => {
  describe('PUT /court/{courtCode}/case/{caseNo}', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}`
    const parsedMockData = parseMockResponse(caseMock.response.jsonBody)

    const caseRequest = {
      uponReceiving: 'a request to update a specific case',
      withRequest: {
        method: 'PUT',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const caseResponse = {
      status: 201,
      headers: caseMock.response.headers,
      body: parsedMockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will update and return specific case data',
        ...caseRequest,
        willRespondWith: caseResponse
      }
      return provider.addInteraction(interaction)
    })

    it('updates and returns a specific case', async () => {
      const response = await update(`${provider.mockService.baseUrl}${apiUrl}`, parsedMockData)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
