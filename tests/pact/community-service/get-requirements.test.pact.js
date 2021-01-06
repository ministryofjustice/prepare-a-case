/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')

const { request } = require('../../../server/services/utils/request')
const requirementsMock = require('../../../mappings/community/DX12340A-requirements-1309234876.json')

pactWith({ consumer: 'prepare_a_case/services/community_service', provider: 'get_requirements' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/requirements', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/requirements`
    const parsedMockData = parseMockResponse(requirementsMock.response.jsonBody)

    const probationRecordRequest = {
      uponReceiving: 'a request for requirements of a specific conviction',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const probationRecordResponse = {
      status: requirementsMock.response.status,
      headers: requirementsMock.response.headers,
      body: parsedMockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return the requirements of a specific conviction',
        ...probationRecordRequest,
        willRespondWith: probationRecordResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns the requirements of a conviction', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
