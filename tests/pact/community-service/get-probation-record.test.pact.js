/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const probationRecordMock = require('../../../mappings/community/convictions/DX12340A-convictions.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/probation-record', () => {
    const crn = 'DX12340A'
    const apiUrl = `/offender/${crn}/probation-record`
    const parsedMockData = parseMockResponse(probationRecordMock.response.jsonBody)

    it('returns the defendant\'s probation record', async () => {
      await provider.addInteraction({
        state: 'an offender record exists',
        uponReceiving: 'a request for a defendant\'s probation record data',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          headers: {
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: probationRecordMock.response.status,
          headers: probationRecordMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
