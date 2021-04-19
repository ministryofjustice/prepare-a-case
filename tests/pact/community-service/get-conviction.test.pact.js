/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const convictionMock = require('../../../mappings/community/DX12340A-conviction-1309234876.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}`
    const parsedMockData = parseMockResponse(convictionMock.response.jsonBody)

    it('returns the data for a single conviction', async () => {
      await provider.addInteraction({
        state: 'a defendant has an existing conviction',
        uponReceiving: 'a request for data of a specific conviction',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: convictionMock.response.status,
          headers: convictionMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
