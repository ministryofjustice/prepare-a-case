/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const requirementsMock = require('../../../mappings/community/DX12340A-requirements-1309234876.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/requirements', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/requirements`
    const parsedMockData = parseMockResponse(requirementsMock.response.jsonBody)

    it('returns the requirements of a conviction', async () => {
      await provider.addInteraction({
        state: 'a defendant has an existing conviction',
        uponReceiving: 'a request for requirements of a specific conviction',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: requirementsMock.response.status,
          headers: requirementsMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
