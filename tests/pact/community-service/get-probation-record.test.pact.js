/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { parseMockResponse } = require('../../testUtils/parseMockResponse')
const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-probation-record.test.pact.json')
const schema = require('../../../schemas/get-probation-record.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /offender/{crn}/probation-record', () => {
    const crn = 'DX12340A'
    const apiUrl = `/offender/${crn}/probation-record`
    const parsedMockData = parseMockResponse(pactResponseMock.response.jsonBody)

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(parsedMockData, schema)
    })

    it('returns the defendant\'s probation record', async () => {
      await provider.addInteraction({
        state: 'an offender record exists',
        uponReceiving: 'a request for a defendant\'s probation record data',
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
      validateMocks(process.env.INIT_CWD + '/mappings/community/convictions', schema)
    })
  })
})
