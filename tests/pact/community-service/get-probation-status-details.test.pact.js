/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const probationStatusDetailsMock = require('../../../mappings/matching/probation-status-detail-pact.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/detail', () => {
    const crn = 'D991494'
    const apiUrl = `/offender/${crn}/probation-status-detail`
    const mockData = parseMockResponse(probationStatusDetailsMock.response.jsonBody)

    it('returns the defendant probation status details', async () => {
      await provider.addInteraction({
        state: 'an offender record exists',
        uponReceiving: 'a request for defendant probation status details',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: probationStatusDetailsMock.response.status,
          headers: probationStatusDetailsMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })
  })
})
