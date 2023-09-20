/* global jest */
const caseServiceMock = {
  getCase: jest.fn(),
  getCaseList: jest.fn(),
  getPagedCaseList: jest.fn(),
  getOutcomesList: jest.fn(),
  addCaseComment: jest.fn(),
  deleteCaseComment: jest.fn(),
  addHearingNote: jest.fn(),
  deleteHearingNote: jest.fn(),
  saveDraftHearingNote: jest.fn(),
  updateHearingNote: jest.fn(),
  deleteHearingNoteDraft: jest.fn(),
  addHearingOutcome: jest.fn(),
  deleteCaseCommentDraft: jest.fn(),
  updateCaseComment: jest.fn(),
  assignHearingOutcome: jest.fn(),
  updateHearingOutcomeToResulted: jest.fn()
}

const communityServiceMock = {
  getProbationRecord: jest.fn()
}

module.exports = {
  caseServiceMock,
  communityServiceMock,
  mockResponse: {
    render: jest.fn(),
    send: jest.fn(),
    redirect: jest.fn(),
    locals: {
      user: {
        name: 'Adam Sandler',
        uuid: '78be7d32-d6be-4429-b469-f2b0ba232033'
      }
    }
  },
  getCaseAndTemplateValuesMock: jest.fn()
}
