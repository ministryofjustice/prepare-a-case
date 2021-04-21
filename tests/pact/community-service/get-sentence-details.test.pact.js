/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-sentence-details.test.pact.json')
const schema = require('../../../schemas/get-sentence.schema.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/sentences/{sentenceId}', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const sentenceId = '123123128'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/sentences/${sentenceId}`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns the conviction sentence details', async () => {
      await provider.addInteraction({
        state: 'the defendant has an existing conviction',
        uponReceiving: 'a request for a specific conviction sentence details',
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
      const mockPath = process.env.INIT_CWD + '/mappings/community/sentence'
      validateMocks(mockPath, schema)
    })
  })
})
