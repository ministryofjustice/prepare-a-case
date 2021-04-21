/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-probation-status-detail.test.pact.json')
const schema = require('../../../schemas/probation-status-detail.schema.json')

pactWith({ consumer: 'Prepare a case', provider: 'Court case service' }, provider => {
  describe('GET /offender/{crn}/detail', () => {
    const crn = 'D991494'
    const apiUrl = `/offender/${crn}/probation-status-detail`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns the defendant probation status details', async () => {
      await provider.addInteraction({
        state: 'an offender record exists',
        uponReceiving: 'a request for defendant probation status details',
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
      const mockPath = process.env.INIT_CWD + '/mappings/matching/probation-status-detail'
      validateMocks(mockPath, schema)
    })
  })
})
