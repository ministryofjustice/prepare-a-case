/* global describe, it, expect, jest */

describe('getDeleteCaseCommentConfirmationHandler', () => {
  const {
    getCaseAndTemplateValuesMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getDeleteCaseCommentConfirmationHandler')(getCaseAndTemplateValuesMock)
  const defendantId = 'test-defendant-id'
  const hearingId = 'test-hearing-id'

  const commentTwo = {
    commentId: 1234561,
    caseId: '1f93aa0a-7e46-4885-a1cb-f25a4be33a00',
    comment: 'Comment Two',
    created: '2022-08-09T17:17:09',
    author: 'Adam Sandler Two',
    createdByUuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
  }

  const caseComments = [
    {
      commentId: 1234560,
      caseId: '1f93aa0a-7e46-4885-a1cb-f25a4be33a00',
      comment: 'Comment One',
      created: '2022-08-09T17:17:09',
      author: 'Adam Sandler',
      createdByUuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
    },
    { ...commentTwo },
    {
      commentId: 1234551,
      caseId: '1f93aa0a-7e46-4885-a1cb-f25a4be33a00',
      comment: 'Comment Three',
      created: '2022-08-19T17:17:09',
      author: 'Adam Sandler Three',
      createdByUuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
    }
  ]

  const commentId = 1234561
  const courtCode = 'B1007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId, hearingId, commentId, courtCode },
    query: { page: 1 },
    path: '/test/path'
  }
  const testCrn = 'test-crn'
  const testCase = { caseId: 'test-case-id', crn: testCrn, caseComments }

  it('should render delete confirmation template with court name and comment data', async () => {
    // Given
    const testTemplateValues = {
      params: mockRequest.params,
      data: {
        ...testCase
      }
    }
    getCaseAndTemplateValuesMock.mockReturnValueOnce(testTemplateValues)
    // When
    await subject(mockRequest, mockResponse)

    // Then
    expect(getCaseAndTemplateValuesMock).toHaveBeenLastCalledWith(mockRequest)
    expect(mockResponse.render).toHaveBeenCalledWith('confirm-delete-comment', {
      ...testTemplateValues,
      ...commentTwo,
      backLink: `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#previousComments`,
      backText: 'Go back'
    })
  })
})
