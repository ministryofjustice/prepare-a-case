/* global jest */
const caseServiceMock = {
  getCase: jest.fn(),
  getCaseList: jest.fn(),
  addCaseComment: jest.fn(),
  deleteCaseComment: jest.fn(),
  addHearingNote: jest.fn(),
  deleteHearingNote: jest.fn(),
  saveDraftHearingNote: jest.fn(),
  updateHearingNote: jest.fn(),
  deleteHearingNoteDraft: jest.fn()
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
        name: 'Adam Sandler'
      }
    }
  },
  getCaseAndTemplateValuesMock: jest.fn()
}
