/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-probation-status-detail.test.pact.json')
const schema = require('../../../schemas/get-probation-status-detail.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /offender/{crn}/detail', () => {
    const mockData = pactResponseMock.response.jsonBody
    const apiUrl = pactResponseMock.request.path

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('returns the defendant probation status details', async () => {
      await provider.addInteraction({
        state: 'an offender record exists',
        uponReceiving: 'a request for defendant probation status details',
        withRequest: {
          method: pactResponseMock.request.method,
          path: apiUrl,
          headers: pactResponseMock.request.headers
        },
        willRespondWith: {
          status: pactResponseMock.response.status,
          headers: pactResponseMock.response.headers,
          body: Matchers.like(mockData)
        }
      })

      const response = await request(`${provider.mockService.baseUrl}${apiUrl}`)
      expect(response.data).toEqual(mockData)
      return response
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      const mockPath = process.env.INIT_CWD + '/mappings/matching/probation-status-detail'
      validateMocks(mockPath, schema)
    })
  })
})
