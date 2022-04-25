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

jest.mock('../../server/routes/middleware/healthcheck')
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
    req.params.courtCode = 'B14LO'
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

  it('should route to the user guide', () => {
    return request(app).get('/user-guide').then(response => {
      expect(response.statusCode).toEqual(200)
    })
  })

  it('should route to the accessibility statement', () => {
    return request(app).get('/accessibility-statement').then(response => {
      expect(response.statusCode).toEqual(200)
    })
  })

  it('should route to the cookies policy page', () => {
    return request(app).get('/cookies-policy').then(response => {
      expect(response.statusCode).toEqual(200)
    })
  })

  it('should route to the cookie preference', () => {
    return request(app).post('/cookie-preference/?page=1').then(response => {
      expect(response.statusCode).toEqual(301)
    })
  })

  it('should remove trailing slash from route (and preserve any querystring) in order to permit the use of relative links', () => {
    return request(app).get('/B14LO/cases/2020-11-12/?page=1').then(response => {
      expect(response.statusCode).toEqual(301)
      expect(response.headers.location).toBe('/B14LO/cases/2020-11-12?page=1')
    })
  })

  it('case list route should display Monday\'s case list when viewing the empty case list on Sunday', async () => {
    mockDate.set('2020-11-15')
    const response = await request(app).get('/B14LO/cases')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO', '2020-11-16', undefined, undefined)
    mockDate.reset()
    return response
  })

  it('empty case list route should show case list for today\'s date', async () => {
    mockDate.set('2020-11-12')
    const response = await request(app).get('/B14LO/cases')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO', '2020-11-12', undefined, undefined)
    mockDate.reset()
    return response
  })

  it('case list route should call the case service to fetch case list data', async () => {
    const response = await request(app).get('/B14LO/cases/2020-01-01')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO', '2020-01-01', undefined, false)
    return response
  })

  it('case list route should call the case service to fetch recently added case list data', async () => {
    const response = await request(app).get('/B14LO/cases/2020-01-01/added')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO', '2020-01-01', undefined, 'added')
    return response
  })

  it('case list route should call the case service to fetch recently removed case list data', async () => {
    const response = await request(app).get('/B14LO/cases/2020-01-01/removed')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO', '2020-01-01', undefined, 'removed')
    return response
  })

  it('case list route should redirect when filtering case list', async () => {
    return request(app).post('/B14LO/cases/2020-01-01', {}).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('case summary details route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/B14LO/hearing/0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/summary')
    expect(caseService.getCase).toHaveBeenCalledWith('0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec', '8597a10b-d330-43e5-80c3-27ce3b46979f')
    return response
  })

  it('case summary details route should redirect when viewing all previous orders', () => {
    return request(app).post('/B14LO/hearing/0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/record', {}).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('case summary probation record route should call the case service to fetch case data', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    const response = await request(app).get('/B14LO/hearing/0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/record')
    expect(caseService.getCase).toHaveBeenCalledWith('0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec', '8597a10b-d330-43e5-80c3-27ce3b46979f')
    expect(communityService.getProbationRecord).toHaveBeenCalledWith('D985513', true)
    return response
  })

  it('case summary get conviction route should call the case service to fetch data for a single conviction', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    const response = await request(app).get('/B14LO/hearing/0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec/defendant/8597a10b-d330-43e5-80c3-27ce3b46979f/record/1403337513')
    expect(caseService.getCase).toHaveBeenCalledWith('0fb0f325-ef18-4c0f-9e87-a6e916d9d1ec', '8597a10b-d330-43e5-80c3-27ce3b46979f')
    expect(communityService.getConviction).toHaveBeenCalledWith('D985513', '1403337513')
    return response
  })

  it('case summary attendance route should call the case service to fetch attendance data', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    communityResponse = {
      convictionId: 1403337513,
      active: true,
      sentence: {
        sentenceId: '12345678'
      }
    }
    const response = await request(app).get('/B14LO/hearing/5d0d02d4-3e2b-4008-be56-4ab486bf7f50/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1403337513')
    expect(caseService.getCase).toHaveBeenCalledWith('5d0d02d4-3e2b-4008-be56-4ab486bf7f50', 'cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc')
    expect(communityService.getSentenceDetails).toHaveBeenCalledWith('D985513', '1403337513')
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
    const response = await request(app).get('/B14LO/hearing/5d0d02d4-3e2b-4008-be56-4ab486bf7f50/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1403337513')
    expect(caseService.getCase).toHaveBeenCalledWith('5d0d02d4-3e2b-4008-be56-4ab486bf7f50', 'cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc')
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

    const response = await request(app).get('/B14LO/hearing/5d0d02d4-3e2b-4008-be56-4ab486bf7f50/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1403337513/breach/12345')
    expect(caseService.getCase).toHaveBeenCalledWith('5d0d02d4-3e2b-4008-be56-4ab486bf7f50', 'cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc')
    expect(communityService.getProbationRecord).toHaveBeenCalledWith('D985513')
    expect(communityService.getBreachDetails).toHaveBeenCalledWith('D985513', '1403337513', '12345')
    return response
  })

  it('case summary risk registers route should call the case service to fetch risk data', async () => {
    caseResponse = {
      crn: 'D985513'
    }

    const response = await request(app).get('/B14LO/hearing/f76f1dfe-c41e-4242-b5fa-865d7dd2ce57/defendant/062c670d-fdf6-441f-99e1-d2ce0c3a3846/risk')
    expect(caseService.getCase).toHaveBeenCalledWith('f76f1dfe-c41e-4242-b5fa-865d7dd2ce57', '062c670d-fdf6-441f-99e1-d2ce0c3a3846')
    expect(communityService.getRiskDetails).toHaveBeenCalledWith('D985513')
    return response
  })

  it('bulk matching route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/B14LO/match/bulk/2020-01-01')
    expect(caseService.getCaseList).toHaveBeenCalledWith('B14LO', '2020-01-01')
    return response
  })

  it('defendant match selection screen should call the case service to fetch case data and match details data', async () => {
    const response = await request(app).get('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730')

    expect(caseService.getCase).toHaveBeenCalledWith('mock-hearing-id', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(caseService.getMatchDetails).toHaveBeenCalledWith('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    return response
  })

  it('defendant match selection route should redirect when form error', () => {
    return request(app).post('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730', {}).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant match selection route should redirect when submitting confirmation', () => {
    return request(app).post('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730', { crn: 'V178657' }).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant confirm no match route should update the case data and redirect', async () => {
    const requestUrl = '/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/nomatch'
    const response = await request(app).get(requestUrl)
    const calledWith = {
      breach: null,
      crn: null,
      cro: null,
      pnc: null,
      preSentenceActivity: null,
      awaitingPsr: null,
      probationStatus: 'NO_RECORD',
      probationStatusActual: 'NO_RECORD'
    }
    expect(caseService.getCase).toHaveBeenCalledWith('mock-hearing-id', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(caseService.getMatchDetails).not.toHaveBeenCalled()
    expect(caseService.updateCase).toHaveBeenCalledWith('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730', calledWith)
    expect(response.header.location).toEqual('/B14LO/hearing/mock-hearing-id/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/summary')
    expect(response.statusCode).toEqual(302)
    return response
  })

  it('defendant manual match route should call the case service for case data', async () => {
    const response = await request(app).get('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/manual')
    expect(caseService.getCase).toHaveBeenCalledWith('mock-hearing-id', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    return response
  })

  it('defendant manual match route should redirect when submitting a valid CRN', () => {
    return request(app).post('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/manual', { crn: 'V178657' }).then(response => {
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant manual match confirmation route should call the case service for case data', async () => {
    const response = await request(app).get('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/confirm/C178657')
    expect(caseService.getCase).toHaveBeenCalledWith('mock-hearing-id', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
    expect(communityService.getDetails).toHaveBeenCalledWith('C178657')
    return response
  })

  it('defendant manual match confirm submission route should call case-service methods and redirect', () => {
    return request(app).post('/B14LO/case/d9628cdd-c3a1-4113-80ba-ef3f8d18df9d/match/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/confirm', { crn: 'V178657' }).then(response => {
      expect(caseService.getCase).toHaveBeenCalledWith('mock-hearing-id', '2e0afeb7-95d2-42f4-80e6-ccf96b282730')
      expect(caseService.updateCase).toHaveBeenCalledWith('d9628cdd-c3a1-4113-80ba-ef3f8d18df9d', '2e0afeb7-95d2-42f4-80e6-ccf96b282730', expect.any(Object))
      expect(response.header.location).toEqual('/B14LO/hearing/mock-hearing-id/defendant/2e0afeb7-95d2-42f4-80e6-ccf96b282730/summary')
      expect(response.statusCode).toEqual(302)
    })
  })

  it('defendant unlink route should call case-service and community-service methods', async () => {
    const response = await request(app).get('/B14LO/case/f76f1dfe-c41e-4242-b5fa-865d7dd2ce57/match/defendant/062c670d-fdf6-441f-99e1-d2ce0c3a3846/unlink/D541487')
    expect(caseService.getCase).toHaveBeenCalledWith('mock-hearing-id', '062c670d-fdf6-441f-99e1-d2ce0c3a3846')
    expect(communityService.getDetails).toHaveBeenCalledWith('D541487')
    return response
  })

  it('licence details route should call the case service to fetch licence details data', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    communityResponse = {
      convictions: [{
        convictionId: 1403337513
      }]
    }
    const response = await request(app).get('/B14LO/hearing/5d0d02d4-3e2b-4008-be56-4ab486bf7f50/defendant/cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc/record/1403337513/licence-details')
    expect(caseService.getCase).toHaveBeenCalledWith('5d0d02d4-3e2b-4008-be56-4ab486bf7f50', 'cf6ce65e-48f9-4b62-9d39-67fbfe68e9fc')
    expect(communityService.getProbationRecord).toHaveBeenCalledWith('D985513')
    return response
  })
})
