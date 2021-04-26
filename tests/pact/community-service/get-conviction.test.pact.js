/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-conviction.test.pact.json')
const schema = require('../../../schemas/get-conviction.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}', () => {
    const crn = 'DX12340A'
    const convictionId = '1309234876'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns the data for a single conviction', async () => {
      await provider.addInteraction({
        state: 'a defendant has an existing conviction',
        uponReceiving: 'a request for data of a specific conviction',
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
      validateMocks(process.env.INIT_CWD + '/mappings/community/conviction', schema)
    })
  })
})
