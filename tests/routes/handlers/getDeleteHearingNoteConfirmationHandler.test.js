/* global describe, it, expect, jest */

describe('getDeleteHearingNoteConfirmationHandler', () => {
  const {
    getCaseAndTemplateValuesMock,
    mockResponse
  } = require('./test-helpers')
  const subject = require('../../../server/routes/handlers/getDeleteHearingNoteConfirmationHandler')(getCaseAndTemplateValuesMock)
  const defendantId = 'test-defendant-id'
  const hearingId = 'test-hearing-id'

  const note = {
    noteId: 1234561,
    note: 'Note Two',
    created: '2022-08-09T17:17:09',
    author: 'Adam Sandler Two',
    createdByUuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
  }

  const notes = [
    {
      noteId: 1234560,
      note: 'Note One',
      created: '2022-08-09T17:17:09',
      author: 'Adam Sandler',
      createdByUuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
    },
    { ...note },
    {
      noteId: 1234551,
      note: 'Note Three',
      created: '2022-08-19T17:17:09',
      author: 'Adam Sandler Three',
      createdByUuid: 'b2679ef7-084d-4f7f-81dd-2d44aae74cbb'
    }
  ]

  const hearings = [
    {
      hearingId: 'hearing-id-three',
      notes: []
    },
    {
      hearingId: 'hearing-id-one',
      notes
    },
    {
      hearingId: 'hearing-id-two',
      notes: []
    }
  ]

  const targetHearingId = 'hearing-id-one'
  const noteId = 1234561
  const courtCode = 'B1007'

  const mockRequest = {
    redisClient: { getAsync: jest.fn() },
    params: { defendantId, hearingId, courtCode },
    query: { page: 1, targetHearingId, noteId },
    path: '/test/path'
  }
  const testCrn = 'test-crn'
  const testCase = { caseId: 'test-case-id', crn: testCrn, hearings }

  it('should render delete confirmation template with court name and note data', async () => {
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
    expect(mockResponse.render).toHaveBeenCalledWith('confirm-delete-hearing-note', {
      ...testTemplateValues,
      ...note,
      targetHearingId,
      backLink: `/${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary#case-progress-hearing-${targetHearingId}`,
      backText: 'Go back'
    })
  })
})
