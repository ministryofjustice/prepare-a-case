/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const selectedCourtsMock = require('../../../mappings/preferences/default-courts.json')

pactWith({ consumer: 'prepare-a-case', provider: 'hmpps-user-preferences' }, provider => {
  describe('GET /preferences/courts', () => {
    const apiUrl = '/users/username/preferences/courts'
    const mockData = selectedCourtsMock.response.jsonBody

    it('returns the user selected courts', async () => {
      await provider.addInteraction({
        state: 'a user has selected relevant courts',
        uponReceiving: 'a request for the user preferences with their chosen courts',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: selectedCourtsMock.response.status,
          headers: selectedCourtsMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
