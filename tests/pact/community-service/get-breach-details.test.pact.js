/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const breachMock = require('../../../mappings/community/D991494-breach-12345.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/breaches/{breachId}', () => {
    const crn = 'D991494'
    const convictionId = '1361422142'
    const breachId = '12345'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/breaches/${breachId}`
    const mockData = breachMock.response.jsonBody

    it('returns the conviction breach details', async () => {
      await provider.addInteraction({
        state: 'will return the specific conviction breach details',
        uponReceiving: 'a request for a specific conviction breach details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: breachMock.response.status,
          headers: breachMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
