/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const { request } = require('../../../server/services/utils/request')
const pactResponseMock = require('./get-case-list.test.pact.json')
const schema = require('../../../schemas/get-case-list.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /court/{courtCode}/cases?date={YYYY-MM-DD}', () => {
    const mockData = pactResponseMock.response.jsonBody
    const apiUrl = pactResponseMock.request.path
    const apiQuery = pactResponseMock.request.query

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('returns a list of cases', async () => {
      await provider.addInteraction({
        state: 'a list of cases exist for the given date',
        uponReceiving: 'a request for a list of cases',
        withRequest: {
          method: pactResponseMock.request.method,
          path: apiUrl,
          query: apiQuery,
          headers: pactResponseMock.request.headers
        },
        willRespondWith: {
          status: pactResponseMock.response.status,
          headers: pactResponseMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}?${apiQuery}`)
      expect(response.data).toEqual(mockData)
      return response
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/case-list', schema, ['case-list-error.json', 'case-list-paginated.json'])
    })
  })
})
