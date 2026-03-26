/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createCaseService } = require('../../../server/services/case-service')
const { validateSchema, validateMocks } = require('../../testUtils/schemaValidation')
const schema = require('../../../schemas/post-case-comment-schema.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('POST /cases/{caseId}/comments', () => {
    const caseId = 'f76f1dfe-c41e-4242-b5fa-865d7dd2ce57'
    const requestBody = {
      caseId,
      comment: 'A comment',
      author: 'Adam Sandler'
    }

    it('should validate the JSON schema against the provided request sample data', () => {
      validateSchema(requestBody, schema)
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/wiremock/mappings/court-case-service/case-comments', schema)
    })

    it('Creates case comment successfully', async () => {
      const addCommentResponse = {
        ...requestBody,
        created: '2022-08-24T15:42:41',
        createdByUuid: 'cc2285f2-91b0-4e00-bd5e-9bdc35896bb6',
        commentId: 12234
      }
      await provider.addInteraction({
        state: 'a case exists with the given case id',
        uponReceiving: 'a request to create a case comment',
        withRequest: {
          method: 'POST',
          path: `/cases/${caseId}/comments`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: addCommentResponse
        }
      })

      const caseService = createCaseService(provider.mockService.baseUrl)
      const response = await caseService.addCaseComment(caseId, 'A comment', 'Adam Sandler')
      expect(response.status).toEqual(201)
      expect(response.data).toEqual(addCommentResponse)
    })
  })
})
