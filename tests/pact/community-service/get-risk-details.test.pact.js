/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const riskDetailsMock = require('../../../mappings/community/D541487-registrations.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/registrations', () => {
    const crn = 'D541487'
    const apiUrl = `/offender/${crn}/registrations`
    const mockData = riskDetailsMock.response.jsonBody

    it('returns the defendant risk details', async () => {
      await provider.addInteraction({
        state: 'the defendant has an existing risk assessment',
        uponReceiving: 'a request for defendant risk details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: riskDetailsMock.response.status,
          headers: riskDetailsMock.response.headers,
          body: Matchers.like(mockData)
        }
      })
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
