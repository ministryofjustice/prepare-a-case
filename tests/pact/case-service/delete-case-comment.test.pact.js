/* global describe, it, expect */
const { pactWith } = require('jest-pact')
const { createCaseService } = require('../../../server/services/case-service')

pactWith({ consumer: 'prepare-a-case', provider: 'court-case-service' }, provider => {
  describe('DELETE /cases/{caseId}/comments/{commentId}', () => {
    const caseId = 'f76f1dfe-c41e-4242-b5fa-865d7dd2ce57'
    const defendantId = '062c670d-fdf6-441f-99e1-d2ce0c3a3846'

    it('deletes the case comment with given case id, defendant id and comment id', async () => {
      await provider.addInteraction({
        state: 'a case exists with the given case id and defendant id',
        uponReceiving: 'a request to delete a comment on a case',
        withRequest: {
          method: 'DELETE',
          path: `/cases/${caseId}/defendants/${defendantId}/comments/1234`
        },
        willRespondWith: {
          status: 200
        }
      })

      const service = createCaseService(provider.mockService.baseUrl)
      const response = await service.deleteCaseComment(caseId,defendantId, 1234)
      expect(response.status).toEqual(200)
    })
  })
})
