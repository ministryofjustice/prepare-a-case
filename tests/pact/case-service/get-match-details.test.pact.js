/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-match-details.test.pact.json')
const schema = require('../../../schemas/get-match-details.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /court/{courtCode}/case/{caseNo}/matchesDetail', () => {
    const courtCode = 'B14LO'
    const caseNo = '351196424'
    const apiUrl = `/court/${courtCode}/case/${caseNo}/matchesDetail`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns match details', async () => {
      await provider.addInteraction({
        state: 'the defendant has possible matches with existing offender records',
        uponReceiving: 'a request for match details',
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
      validateMocks(process.env.INIT_CWD + '/mappings/matching/matches-detail', schema)
    })
  })
})
