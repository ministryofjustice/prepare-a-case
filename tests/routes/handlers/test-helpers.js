const caseServiceMock = {
  getCase: jest.fn(),
  getCaseList: jest.fn()
}

const communityServiceMock = {
  getProbationRecord: jest.fn()
}

module.exports = {
  caseServiceMock,
  communityServiceMock,
  mockResponse: {
    render: jest.fn()
  },
  getCaseAndTemplateValuesMock: jest.fn()
}
