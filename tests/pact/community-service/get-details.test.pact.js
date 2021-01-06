/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const defendantDetailsMock = require('../../../mappings/matching/2608860141-detail.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/detail', () => {
    const crn = 'D991494'
    const apiUrl = `/offender/${crn}/detail`
    const mockData = defendantDetailsMock.response.jsonBody

    it('returns the defendant details', async () => {
      await provider.addInteraction({
        state: 'an offender record exists',
        uponReceiving: 'a request for defendant details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: defendantDetailsMock.response.status,
          headers: defendantDetailsMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
