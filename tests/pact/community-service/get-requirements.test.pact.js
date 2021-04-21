/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-requirements.test.pact.json')
const schema = require('../../../schemas/get-requirements.schema.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/convictions/{convictionId}/requirements', () => {
    const crn = 'X320741'
    const convictionId = '2500297061'
    const apiUrl = `/offender/${crn}/convictions/${convictionId}/requirements`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns the requirements of a conviction', async () => {
      await provider.addInteraction({
        state: 'a defendant has an existing conviction',
        uponReceiving: 'a request for requirements of a specific conviction',
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
      const mockPath = process.env.INIT_CWD + '/mappings/community/requirements'
      validateMocks(mockPath, schema)
    })
  })
})
