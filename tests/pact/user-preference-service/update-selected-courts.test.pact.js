/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { update } = require('../../../server/services/utils/request')
const selectedCourtsMock = require('../../../wiremock/mappings/hmpps-user-preferences/default-courts.json')

pactWith({ consumer: 'prepare-a-case', provider: 'hmpps-user-preferences' }, provider => {
  describe('PUT /preferences/courts', () => {
    const apiUrl = '/users/username/preferences/courts'
    const mockData = selectedCourtsMock.response.jsonBody

    it('updates and returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a user has selected relevant courts',
        uponReceiving: 'a request to update a the user preferences with their chosen courts',
        withRequest: {
          method: 'PUT',
          path: apiUrl,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: mockData
        },
        willRespondWith: {
          status: 201,
          headers: selectedCourtsMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await update(`${provider.mockService.baseUrl}${apiUrl}`, mockData)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
