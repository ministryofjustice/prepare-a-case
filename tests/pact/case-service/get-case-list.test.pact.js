/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')
const moment = require('moment')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const caseListMock = require('../../../mappings/case-list-full.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /court/{courtCode}/cases?date={YYYY-MM-DD}', () => {
    const courtCode = 'B14LO'
    const apiUrl = `/court/${courtCode}/cases`
    const today = moment().format('YYYY-MM-DD')
    const parsedMockData = parseMockResponse(caseListMock.response.jsonBody)

    it('returns a list of cases', async () => {
      await provider.addInteraction({
        state: 'a list of cases exist for the given date',
        uponReceiving: 'a request for a list of cases',
        withRequest: {
          method: 'GET',
          path: apiUrl,
          query: {
            date: today
          },
          headers: {
            Accept: 'application/json, text/plain, */*'
          }
        },
        willRespondWith: {
          status: caseListMock.response.status,
          headers: caseListMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}?date=${today}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })
  })
})
