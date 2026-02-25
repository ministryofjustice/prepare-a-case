/* global describe, beforeEach, afterEach, it, expect, jest, beforeAll, afterAll */

const express = require('express')
const request = require('supertest')
const mockDate = require('mockdate')

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
    end: jest.fn(),
    connect: jest.fn(),
    multi: jest.fn(() => ({ exec: jest.fn() })),
    exec: jest.fn(),
    expire: jest.fn()
  }))
}))

const caseService = require('../../server/services/case-service')
const communityService = require('../../server/services/community-service')
const helpers = require('../../server/routes/helpers')
const { authenticationMiddleware } = require('../testUtils/mockAuthentication')
const getOutcomeTypesListFilters = require('../../server/utils/getOutcomeTypesListFilters')

let roles
jest.doMock('jwt-decode', () => jest.fn(() => ({ authorities: roles })))

const createRouter = require('../../server/routes/index')
const defaults = require('../../server/routes/middleware/defaults')
const healthcheck = require('../../server/routes/middleware/healthcheck')
const features = require('../../server/utils/features')

jest.mock('../../server/routes/middleware/healthcheck')
jest.mock('../../server/routes/helpers')
jest.mock('../../server/services/case-service')
jest.mock('../../server/services/community-service')

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

function buildTestApp (router) {
  const app = express()
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use((req, res, next) => {
    req.session = req.session || {}
    req.redisClient = req.redisClient || {
      getAsync: jest.fn(),
      setAsync: jest.fn(),
      delAsync: jest.fn()
    }
    next()
  })

  app.use((req, res, next) => {
    res.render = (view, model) => res.status(200).send({ view, model })
    next()
  })

  app.use('/', router)

  app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message, stack: err.stack })
  })

  return app
}

const viewRoute = createRouter({ authenticationMiddleware })

let app
let caseResponse = {}
let communityResponse = {}
let defaultSort = []

describe('Routes', () => {
  jest
    .spyOn(healthcheck, 'health')
    .mockImplementation(function (req, res, next) {
      return next()
    })

  jest
    .spyOn(defaults, 'defaults')
    .mockImplementation(function (req, res, next) {
      req.params.courtCode = 'B14LO'
      req.params.courtName = "Sheffield Magistrates' Court"
      req.params.courtRooms = 10
      return next()
    })

  jest.spyOn(caseService, 'getCaseList').mockImplementation(function () {
    return { cases: [] }
  })

  jest.spyOn(caseService, 'getPagedCaseList').mockImplementation(function () {
    return { totalElements: 1, cases: [] }
  })

  jest.spyOn(caseService, 'getOutcomesList').mockImplementation(function () {
    return { cases: [], filters: [] }
  })

  jest.spyOn(caseService, 'getCase').mockImplementation(function () {
    return caseResponse
  })

  jest.spyOn(caseService, 'updateOffender').mockImplementation(function () {
    return { status: 200, data: { probationStatus: 'Current' } }
  })

  jest.spyOn(caseService, 'deleteOffender').mockImplementation(function () {
    return { status: 200 }
  })

  jest.spyOn(communityService, 'getProbationRecord').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getConviction').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getDetails').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getProbationStatusDetails').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getSentenceDetails').mockImplementation(function () {
    return { attendances: [] }
  })

  jest.spyOn(communityService, 'getBreachDetails').mockImplementation(function () {
    return { conviction: {} }
  })

  jest.spyOn(communityService, 'getRiskDetails').mockImplementation(function () {
    return { registrations: {} }
  })

  jest.spyOn(helpers, 'getOrderTitle').mockImplementation(() => 'title')
  jest.spyOn(helpers, 'prepareCourtRoomFilters').mockImplementation(() => [])
  jest.spyOn(helpers, 'getMatchedUrl').mockImplementation((matchType, matchDate, hearingId, defendantId, courtCode) => {
    return matchType === 'bulk'
      ? `${courtCode}/match/bulk/${matchDate}`
      : `${courtCode}/hearing/${hearingId}/defendant/${defendantId}/summary`
  })

  let enabledHearingOutcomes

  beforeAll(() => {
    enabledHearingOutcomes = features.hearingOutcomes.isEnabled
    features.hearingOutcomes.isEnabled = () => true

    caseService.getOutcomeTypes.mockReturnValue({
      types: [
        { label: 'Probation sentence', value: 'PROBATION_SENTENCE' },
        { label: 'Non-probation sentence', value: 'NON_PROBATION_SENTENCE' },
        { label: 'Report requested', value: 'REPORT_REQUESTED' },
        { label: 'Adjourned', value: 'ADJOURNED' },
        { label: 'Committed to Crown', value: 'COMMITTED_TO_CROWN' },
        { label: 'Crown plus PSR', value: 'CROWN_PLUS_PSR' },
        { label: 'No outcome', value: 'NO_OUTCOME' },
        { label: 'Other', value: 'OTHER' }
      ]
    })
  })

  afterAll(() => {
    features.hearingOutcomes.isEnabled = enabledHearingOutcomes
    jest.clearAllMocks()
  })

  beforeEach(async () => {
    app = buildTestApp(viewRoute)

    await getOutcomeTypesListFilters()
    defaultSort = [{ id: 'hearingDate', value: 'NONE' }]
  })

  afterEach(() => {
    jest.clearAllMocks()
    caseResponse = {}
    communityResponse = {}
    mockDate.reset()
  })

  it("case list route should display Monday's case list when viewing the empty case list on Sunday", async () => {
    mockDate.set('2020-11-15')
    const response = await request(app).get('/B14LO/cases')

    expect(response.statusCode).toEqual(200)
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

    expect(response.statusCode).toEqual(200)
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

    expect(response.statusCode).toEqual(200)
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

    expect(response.statusCode).toEqual(200)
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

    expect(response.statusCode).toEqual(200)
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
    let temp

    beforeAll(() => {
      temp = features.hearingOutcomes.isEnabled
      features.hearingOutcomes.isEnabled = () => true
    })

    afterAll(() => {
      features.hearingOutcomes.isEnabled = temp
    })

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
