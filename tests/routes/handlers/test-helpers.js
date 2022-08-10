/* global jest */
const caseServiceMock = {
  getCase: jest.fn(),
  getCaseList: jest.fn(),
  addCaseComment: jest.fn()
}

const communityServiceMock = {
  getProbationRecord: jest.fn()
}

module.exports = {
  caseServiceMock,
  communityServiceMock,
  mockResponse: {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: {
      name: 'Adam Sandler'
    }
  },
  getCaseAndTemplateValuesMock: jest.fn()
}
