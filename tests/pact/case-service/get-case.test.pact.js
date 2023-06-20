/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { Matchers } = require('@pact-foundation/pact')

const { request } = require('../../../server/services/utils/request')
const { validateMocks, validateSchema } = require('../../testUtils/schemaValidation')
const pactResponseMock = require('./get-case.test.pact.json')
const schema = require('../../../schemas/get-case.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('GET /hearing/{hearingId}/defendant/{defendantId}', () => {
    const mockData = pactResponseMock.response.jsonBody
    const apiUrl = pactResponseMock.request.path

    it('should validate the JSON schema against the provided sample data', () => {
      validateSchema(mockData, schema)
    })

    it('returns a specific case', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case id and defendant id',
        uponReceiving: 'a request for a specific case',
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
      validateMocks(process.env.INIT_CWD + '/mappings/cases', schema, ['create-case-comment.json', 'delete-case-comment.json', 'delete-comment-draft.json', 'create-hearing-note.json'])
    })
  })
})
