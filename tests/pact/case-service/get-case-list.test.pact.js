/* global describe, beforeEach, it, expect */
const { pactWith } = require('jest-pact')
const moment = require('moment')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')

const { request } = require('../../../server/services/utils/request')
const caseListMock = require('../../../mappings/case-list-full.json')

pactWith({ consumer: 'prepare_a_case/services/case_service', provider: 'get_case_list' }, provider => {
  describe('GET /court/{courtCode}/cases?date={YYYY-MM-DD}', () => {
    const courtCode = 'B14LO'
    const apiUrl = `/court/${courtCode}/cases`
    const today = moment().format('YYYY-MM-DD')
    const parsedMockData = parseMockResponse(caseListMock.response.jsonBody)

    const caseListRequest = {
      uponReceiving: 'a request for a list of cases',
      withRequest: {
        method: 'GET',
        path: apiUrl,
        query: {
          "date": today,
        },
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      }
    }

    const caseListResponse = {
      status: caseListMock.response.status,
      headers: caseListMock.response.headers,
      body: parsedMockData
    }

    beforeEach(() => {
      const interaction = {
        state: 'will return case list data',
        ...caseListRequest,
        willRespondWith: caseListResponse
      }
      return provider.addInteraction(interaction)
    })

    it('returns a list of cases', async () => {
      const response = await request(`${provider.mockService.baseUrl}${apiUrl}?date=${today}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
