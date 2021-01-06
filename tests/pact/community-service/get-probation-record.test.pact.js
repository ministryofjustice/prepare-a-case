/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')

const { request } = require('../../../server/services/utils/request')
const probationRecordMock = require('../../../mappings/community/DX12340A-convictions.json')

pactWith({ consumer: 'prepare_a_case/services/community_service', provider: 'get_probation_record' }, provider => {
  describe('GET /offender/{crn}/probation-record', () => {
    const crn = 'DX12340A'
    const apiUrl = `/offender/${crn}/probation-record`
    const parsedMockData = parseMockResponse(probationRecordMock.response.jsonBody)

    const probationRecordRequest = {
      uponReceiving: 'a request for a defendant\'s probation record data',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const probationRecordResponse = {
      status: probationRecordMock.response.status,
      headers: probationRecordMock.response.headers,
      body: parsedMockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return the defendant\'s probation record data',
        ...probationRecordRequest,
        willRespondWith: probationRecordResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns the defendant\'s probation record', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
