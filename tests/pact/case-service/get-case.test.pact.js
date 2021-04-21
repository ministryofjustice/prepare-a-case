/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-case.test.pact.json')
const schema = require('../../../schemas/get-case.schema.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /court/{courtCode}/case/{caseNo}', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case number',
        uponReceiving: 'a request for a specific case',
        withRequest: {
          method: 'GET',
          path: apiUrl,
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

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(parsedMockData)
      return response
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/cases', schema)
    })
  })
})
