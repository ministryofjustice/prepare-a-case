/* global describe, beforeEach, afterEach, it, expect, jest */
const request = require('supertest')
const mockDate = require('mockdate')
const caseService = require('../../server/services/case-service')
const communityService = require('../../server/services/community-service')
const appSetup = require('../testUtils/appSetup')
const { authenticationMiddleware } = require('../testUtils/mockAuthentication')

let roles
// This needs mocking early, before 'requiring' jwt-decode
jest.doMock('jwt-decode', () => jest.fn(() => ({ authorities: roles })))

const createRouter = require('../../server/routes/index')

const defaults = require('../../server/routes/middleware/defaults')
const healthcheck = require('../../server/routes/middleware/healthcheck')

const viewRoute = createRouter({
  authenticationMiddleware
})

jest.mock('../../server/services/case-service')
jest.mock('../../server/services/community-service')

let app
let caseResponse = {}
let communityResponse = {}

describe('Routes', () => {
  jest.spyOn(healthcheck, 'health').mockImplementation(function (req, res, next) {
    return next()
  })

  jest.spyOn(defaults, 'defaults').mockImplementation(function (req, res, next) {
    req.params.courtCode = 'B14LO00'
    req.params.courtName = 'Sheffield Magistrates\' Court'
    req.params.courtRooms = 10
    return next()
  })

  jest.spyOn(caseService, 'getCaseList').mockImplementation(function () {
    return {
      cases: []
    }
  })

  jest.spyOn(caseService, 'getCase').mockImplementation(function () {
    return caseResponse
  })

  jest.spyOn(communityService, 'getProbationRecord').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getProbationRecordWithRequirements').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getDetails').mockImplementation(function () {
    return communityResponse
  })

  jest.spyOn(communityService, 'getSentenceDetails').mockImplementation(function () {
    return {
      attendances: []
    }
  })

  jest.spyOn(communityService, 'getBreachDetails').mockImplementation(function () {
    return {
      conviction: {}
    }
  })

  jest.spyOn(communityService, 'getRiskDetails').mockImplementation(function () {
    return {
      registrations: {}
    }
  })

  jest.spyOn(caseService, 'updateCase').mockImplementation(function () {
    return {
      status: 201,
      data: {
        probationStatus: 'Current'
      }
    }
  })

  beforeEach(() => {
    app = require('../../app')
    app = appSetup(viewRoute)
  })

  afterEach(() => {
    jest.clearAllMocks()
    caseResponse = {}
  })

  it('default route should return status 302 as it should redirect to case list', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('case list route should redirect to corrected route when viewing case list on Sunday', () => {
    mockDate.set('2020-11-15')
    return request(app).get('/B14LO00/cases').then(response => {
      expect(response.statusCode).toEqual(302)
      expect(response.headers.location).toBe('/B14LO00/cases/2020-11-16')
      expect(healthcheck.health).not.toHaveBeenCalled()
      mockDate.reset()
    })
  })

  it('case list route should redirect to corrected route', () => {
    mockDate.set('2020-11-12')
    return request(app).get('/B14LO00/cases').then(response => {
      expect(response.statusCode).toEqual(302)
      expect(response.headers.location).toBe('/B14LO00/cases/2020-11-12')
      expect(healthcheck.health).not.toHaveBeenCalled()
      mockDate.reset()
    })
  })

  it('case list route should call the case service to fetch case list data', async () => {
    const response = await request(app).get('/B14LO00/cases/2020-01-01')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO00', '2020-01-01', expect.any(Array), undefined)
    return response
  })

  it('case list route should call the case service to fetch recently added case list data', async () => {
    const response = await request(app).get('/B14LO00/cases/2020-01-01/added')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO00', '2020-01-01', expect.any(Array), 'added')
    return response
  })

  it('case list route should call the case service to fetch recently removed case list data', async () => {
    const response = await request(app).get('/B14LO00/cases/2020-01-01/removed')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO00', '2020-01-01', expect.any(Array), 'removed')
    return response
  })

  it('case list route should redirect when filtering case list', async () => {
    return request(app).post('/B14LO00/cases/2020-01-01', {}).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('case summary details route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/B14LO00/case/8678951874/summary')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '8678951874')
    return response
  })

  it('case summary details route should redirect when viewing all previous orders', () => {
    return request(app).post('/B14LO00/case/8678951874/record', {}).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('case summary probation record route should call the case service to fetch case data', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    const response = await request(app).get('/B14LO00/case/8678951874/record')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '8678951874')
    expect(communityService.getProbationRecordWithRequirements).toHaveBeenCalledWith('D985513')
    return response
  })

  it('case summary attendance route should call the case service to fetch attendance data', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    communityResponse = {
      convictions: [{
        convictionId: 1403337513,
        active: true,
        sentence: {
          sentenceId: '12345678'
        }
      }]
    }
    const response = await request(app).get('/B14LO00/case/668911253/record/1403337513')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '668911253')
    expect(communityService.getProbationRecordWithRequirements).toHaveBeenCalledWith('D985513')
    expect(communityService.getSentenceDetails).toHaveBeenCalledWith('D985513', '1403337513', '12345678')
    return response
  })

  it('case summary attendance route should NOT call the case service to fetch attendance data if the order is inactive', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    communityResponse = {
      convictions: [{
        convictionId: 1403337513,
        active: false
      }]
    }
    const response = await request(app).get('/B14LO00/case/668911253/record/1403337513')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '668911253')
    expect(communityService.getProbationRecordWithRequirements).toHaveBeenCalledWith('D985513')
    expect(communityService.getSentenceDetails).not.toHaveBeenCalled()
    return response
  })

  it('case summary breach details route should call the case service to fetch breach data', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    communityResponse = {
      convictions: [{
        convictionId: 1403337513,
        breaches: [
          {
            breachId: 12345,
            description: 'Community Order/SSO Breach',
            started: '2014-12-30',
            status: 'In progress'
          },
          {
            breachId: 54321,
            description: 'Community Order/SSO Breach',
            started: '2014-12-26',
            status: 'Breach Summons Issued'
          }
        ]
      }]
    }

    const response = await request(app).get('/B14LO00/case/668911253/record/1403337513/breach/12345')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '668911253')
    expect(communityService.getProbationRecord).toHaveBeenCalledWith('D985513')
    expect(communityService.getBreachDetails).toHaveBeenCalledWith('D985513', '1403337513', '12345')
    return response
  })

  it('case summary risk registers route should call the case service to fetch risk data', async () => {
    caseResponse = {
      crn: 'D985513'
    }

    const response = await request(app).get('/B14LO00/case/2608860141/risk')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '2608860141')
    expect(communityService.getRiskDetails).toHaveBeenCalledWith('D985513')
    return response
  })

  it('bulk matching route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/B14LO00/match/bulk/2020-01-01')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO00', '2020-01-01')
    return response
  })

  it('defendant match selection screen should call the case service to fetch case data and match details data', async () => {
    const response = await request(app).get('/B14LO00/match/defendant/3597035492')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '3597035492')
    expect(caseService.getMatchDetails).toHaveBeenCalledWith('B14LO00', '3597035492')
    return response
  })

  it('defendant match selection route should redirect when form error', () => {
    return request(app).post('/B14LO00/match/defendant/3597035492', {}).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant match selection route should redirect when submitting confirmation', () => {
    return request(app).post('/B14LO00/match/defendant/3597035492', { crn: 'V178657' }).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant confirm no match route should update the case data and redirect', async () => {
    const response = await request(app).get('/B14LO00/match/defendant/3597035492/nomatch')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '3597035492')
    expect(caseService.getMatchDetails).not.toHaveBeenCalled()
    expect(caseService.updateCase).toHaveBeenCalledWith('B14LO00', '3597035492', expect.any(Object))
    expect(response.header.location).toEqual('/B14LO00/case/3597035492/summary')
    expect(response.statusCode).toEqual(302)
    return response
  })

  it('defendant manual match route should call the case service for case data', async () => {
    const response = await request(app).get('/B14LO00/match/defendant/3597035492/manual')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '3597035492')
    return response
  })

  it('defendant manual match route should redirect when submitting a valid CRN', () => {
    return request(app).post('/B14LO00/match/defendant/3597035492/manual', { crn: 'V178657' }).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant manual match confirmation route should call the case service for case data', async () => {
    const response = await request(app).get('/B14LO00/match/defendant/3597035492/confirm/C178657')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '3597035492')
    expect(communityService.getDetails).toHaveBeenCalledWith('C178657')
    return response
  })

  it('defendant manual match confirm submission route should call case-service methods and redirect', () => {
    return request(app).post('/B14LO00/match/defendant/3597035492/confirm', { crn: 'V178657' }).then(response => {
      expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '3597035492')
      expect(caseService.updateCase).toHaveBeenCalledWith('B14LO00', '3597035492', expect.any(Object))
      expect(response.header.location).toEqual('/B14LO00/case/3597035492/summary')
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant unlink route should call case-service and community-service methods', async () => {
    const response = await request(app).get('/B14LO00/match/defendant/2608860141/unlink/D541487')
    expect(caseService.getCase).toHaveBeenCalledWith('B14LO00', '2608860141')
    expect(communityService.getDetails).toHaveBeenCalledWith('D541487')
    return response
  })
})
