/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')
const moment = require('moment')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const { request } = require('../../../server/services/utils/request')
const pactResponseMock = require('./get-case-list.test.pact.json')
const schema = require('../../../schemas/get-case-list.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /court/{courtCode}/cases?date={YYYY-MM-DD}', () => {
    const courtCode = 'B14LO'
    const apiUrl = `/court/${courtCode}/cases`
    const today = moment().format('YYYY-MM-DD')
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

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
            Accept: 'application/json'
          }
        },
        willRespondWith: {
          status: pactResponseMock.response.status,
          headers: pactResponseMock.response.headers,
          body: Matchers.like(parsedMockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}?date=${today}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/case-list', schema)
    })
  })
})
