/* global describe, beforeEach, afterEach, it, expect, jest, beforeAll */

const request = require('supertest')
const mockDate = require('mockdate')
const appSetup = require('../testUtils/appSetup')
const { authenticationMiddleware } = require('../testUtils/mockAuthentication')

const roles = []

jest.mock('jwt-decode', () => jest.fn(() => ({ authorities: roles })))

jest.mock('../../server/services/case-service', () => ({
  getCaseList: jest.fn(),
  getPagedCaseList: jest.fn(),
  getOutcomesList: jest.fn(),
  getOutcomeTypes: jest.fn(),
  getCase: jest.fn(),
  getMatchDetails: jest.fn(),
  updateOffender: jest.fn(),
  deleteOffender: jest.fn()
}))

jest.mock('../../server/services/community-service', () => ({
  getProbationRecord: jest.fn(),
  getConviction: jest.fn(),
  getDetails: jest.fn(),
  getProbationStatusDetails: jest.fn(),
  getSentenceDetails: jest.fn(),
  getBreachDetails: jest.fn(),
  getRiskDetails: jest.fn()
}))

jest.mock('../../server/routes/middleware/healthcheck', () => ({
  health: jest.fn((req, res, next) => next())
}))

jest.mock('../../server/routes/middleware/defaults', () => ({
  defaults: jest.fn((req, res, next) => {
    req.params.courtCode = 'B14LO'
    req.params.courtName = "Sheffield Magistrates' Court"
    req.params.courtRooms = 10
    next()
  })
}))

jest.mock('../../server/routes/helpers', () => ({
  getOrderTitle: jest.fn(() => 'title'),
  prepareCourtRoomFilters: jest.fn(() => []),
  getMatchedUrl: jest.fn((matchType, matchDate, hearingId, defendantId, courtCode) => {
    return matchType === 'bulk'
      ? `${courtCode}/match/bulk/${matchDate}`
      : `${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`
  })
}))

jest.mock('../../server/utils/getOutcomeTypesListFilters', () => {
  return jest.fn(() => ({
    id: 'outcomeType',
    label: 'Outcome type',
    items: [
      { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
      { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
      { label: 'Report requested', value: 'REPORT_REQUESTED' }
    ]
  }))
})

jest.mock('../../server/utils/features', () => ({
  hearingOutcomes: { isEnabled: () => true }
}))

const caseService = require('../../server/services/case-service')
const communityService = require('../../server/services/community-service')
const getOutcomeTypesListFilters = require('../../server/utils/getOutcomeTypesListFilters')

describe('Routes', () => {
  let app
  let defaultSort = []
  let caseResponse = {}
  let communityResponse = {}

  beforeAll(() => {
    caseService.getOutcomeTypes.mockReturnValue({
      types: [
        { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
        { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
        { label: 'Report requested', value: 'REPORT_REQUESTED' },
        { label: 'Adjourned', value: 'ADJOURNED' }
      ]
    })
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    caseService.getCaseList.mockReturnValue({ cases: [] })
    caseService.getPagedCaseList.mockReturnValue({ totalElements: 1, cases: [] })
    caseService.getOutcomesList.mockReturnValue({ cases: [], filters: [] })
    caseService.getCase.mockImplementation(() => caseResponse)
    caseService.updateOffender.mockReturnValue({ status: 200, data: { probationStatus: 'Current' } })
    caseService.deleteOffender.mockReturnValue({ status: 200 })

    communityService.getProbationRecord.mockImplementation(() => communityResponse)
    communityService.getConviction.mockImplementation(() => communityResponse)
    communityService.getDetails.mockImplementation(() => communityResponse)
    communityService.getProbationStatusDetails.mockImplementation(() => communityResponse)
    communityService.getSentenceDetails.mockReturnValue({ attendances: [] })
    communityService.getBreachDetails.mockReturnValue({ conviction: {} })
    communityService.getRiskDetails.mockReturnValue({ registrations: {} })

    await getOutcomeTypesListFilters()
    defaultSort = [{ id: 'hearingDate', value: 'NONE' }]

    jest.isolateModules(() => {
      const createRouter = require('../../server/routes/index')
      const viewRoute = createRouter({ authenticationMiddleware })
      app = appSetup(viewRoute)
    })
  })

  afterEach(() => {
    mockDate.reset()
    caseResponse = {}
    communityResponse = {}
  })

  it("case list route should display Monday's case list when viewing the empty case list on Sunday", async () => {
    mockDate.set('2020-11-15')
    const response = await request(app).get('/B14LO/cases')

    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith(
      'B14LO',
      '2020-11-16',
      {},
      undefined,
      undefined,
      20,
      true
    )
  })

  it("empty case list route should show case list for today's date", async () => {
    mockDate.set('2020-11-12')
    const response = await request(app).get('/B14LO/cases')

    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith(
      'B14LO',
      '2020-11-12',
      {},
      undefined,
      undefined,
      20,
      true
    )
  })

  it('case list route should call the case service to fetch case list data', async () => {
    const response = await request(app).get('/B14LO/cases/2020-01-01')

    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith(
      'B14LO',
      '2020-01-01',
      {},
      false,
      undefined,
      20,
      true
    )
  })

  it('case list route should call the case service to fetch recently added case list data', async () => {
    const response = await request(app).get('/B14LO/cases/2020-01-01/added')

    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith(
      'B14LO',
      '2020-01-01',
      {},
      'added',
      undefined,
      20,
      true
    )
  })

  it('case list route should call the case service to fetch recently removed case list data', async () => {
    const response = await request(app).get('/B14LO/cases/2020-01-01/removed')

    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(caseService.getPagedCaseList).toHaveBeenCalledWith(
      'B14LO',
      '2020-01-01',
      {},
      'removed',
      undefined,
      20,
      true
    )
  })

  describe('Hearing outcomes', () => {
    it('outcomes list route should call the case service to fetch outcome list data', async () => {
      const response = await request(app).get('/B14LO/outcomes')

      expect(response.statusCode).toEqual(200)
      expect(caseService.getOutcomesList).toHaveBeenCalledWith(
        'B14LO',
        expect.anything(),
        defaultSort,
        'NEW'
      )
    })

    it('outcomes list route should call the case service to filter outcome list data', async () => {
      const response = await request(app).get('/B14LO/outcomes?outcomeType=ADJOURNED')

      expect(response.statusCode).toEqual(200)
      expect(caseService.getOutcomesList).toHaveBeenCalledWith(
        'B14LO',
        { outcomeType: ['ADJOURNED'] },
        defaultSort,
        'NEW'
      )
    })

    it('outcomes list route should call the case service to sort outcome list data', async () => {
      const response = await request(app).get('/B14LO/outcomes?hearingDate=ASC')

      expect(response.statusCode).toEqual(200)
      expect(caseService.getOutcomesList).toHaveBeenCalledWith(
        'B14LO',
        { hearingDate: ['ASC'] },
        [{ id: 'hearingDate', value: 'ASC' }],
        'NEW'
      )
    })

    it('outcomes list route should call the case service to filter & sort outcome list data', async () => {
      const response = await request(app).get('/B14LO/outcomes?hearingDate=ASC&outcomeType=ADJOURNED')

      expect(response.statusCode).toEqual(200)
      expect(caseService.getOutcomesList).toHaveBeenCalledWith(
        'B14LO',
        { hearingDate: ['ASC'], outcomeType: ['ADJOURNED'] },
        [{ id: 'hearingDate', value: 'ASC' }],
        'NEW'
      )
    })

    it('outcomes list route should call the case service to filter outcome list data with multiple filters', async () => {
      const response = await request(app).get(
        '/B14LO/outcomes?outcomeType=REPORT_REQUESTED&outcomeType=ADJOURNED'
      )

      expect(response.statusCode).toEqual(200)
      expect(caseService.getOutcomesList).toHaveBeenCalledWith(
        'B14LO',
        { outcomeType: ['REPORT_REQUESTED', 'ADJOURNED'] },
        defaultSort,
        'NEW'
      )
    })
  })
})
