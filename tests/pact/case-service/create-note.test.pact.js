/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createCaseService } = require('../../../server/services/case-service')
const { validateSchema, validateMocks } = require('../../testUtils/schemaValidation')
const schema = require('../../../schemas/post-hearing-note-schema.schema.json')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('POST /cases/{caseId}/notes', () => {
    const caseId = 'f76f1dfe-c41e-4242-b5fa-865d7dd2ce57'
    const requestBody = {
      caseId,
      note: 'A note',
      author: 'Jane Smith'
    }

    it('should validate the JSON schema against the provided request sample data', () => {
      validateSchema(requestBody, schema)
    })

    it('should validate the WireMock mocks against the JSON schema', () => {
      validateMocks(process.env.INIT_CWD + '/mappings/case-notes', schema)
    })

    it('Creates case note successfully', async () => {
      const addNoteResponse = {
        ...requestBody,
        created: '2022-07-09T17:13:09',
        createdByUuid: 'q1111qq1-084d-4f7f-81dd-1q11qqq11qqq',
        noteId: 1234560
      }
      await provider.addInteraction({
        state: 'a case exists with the given case id',
        uponReceiving: 'a request to create a case note',
        withRequest: {
          method: 'POST',
          path: `/cases/${caseId}/notes`,
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
          body: addNoteResponse
        }
      })

      const caseService = createCaseService(provider.mockService.baseUrl)
      const response = await caseService.addHearingNote(caseId, 'A note', 'Jane Smith')
      expect(response.status).toEqual(201)
      expect(response.data).toEqual(addNoteResponse)
    })
  })
})
