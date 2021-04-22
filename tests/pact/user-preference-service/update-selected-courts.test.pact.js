/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { update } = require('../../../server/services/utils/request')
const selectedCourtsMock = require('../../../mappings/preferences/default-courts.json')

pactWith({ consumer: 'Prepare a case', provider: 'User preferences service' }, provider => {
  describe('PUT /preferences/courts', () => {
    const apiUrl = '/preferences/courts'
    const mockData = selectedCourtsMock.response.jsonBody

    it('updates and returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a user has selected relevant courts',
        uponReceiving: 'a request to update a the user preferences with their chosen courts',
        withRequest: {
          method: 'PUT',
          path: apiUrl,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
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
