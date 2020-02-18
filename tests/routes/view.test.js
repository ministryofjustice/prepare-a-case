/* global describe, beforeEach, afterEach, it, expect, jest */
const request = require('supertest')
const caseService = require('../../services/case-service')
const communityService = require('../../services/community-service')

const defaults = require('../../routes/middleware/defaults')
const healthcheck = require('../../routes/middleware/healthcheck')

jest.mock('../../services/case-service')
jest.mock('../../services/community-service')

let app
let caseResponse = {}

describe('Routes', () => {
  jest.spyOn(healthcheck, 'health').mockImplementation(function (req, res, next) {
    return next()
  })

  jest.spyOn(defaults, 'defaults').mockImplementation(function (req, res, next) {
    req.params.courtCode = 'SHF'
    req.params.courtName = 'Sheffield Magistrates\' Court'
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

  jest.spyOn(communityService, 'getPersonalDetails').mockImplementation(function () {
    return {}
  })

  beforeEach(() => {
    app = require('../../app')
  })

  afterEach(() => {
    jest.clearAllMocks()
    caseResponse = {}
  })

  it('default route should return status 200', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toEqual(200)
      expect(healthcheck.health).toHaveBeenCalled()
    })
  })

  it('case list route should redirect to corrected route', () => {
    return request(app).get('/cases').then(response => {
      expect(response.statusCode).toEqual(302)
      expect(healthcheck.health).not.toHaveBeenCalled()
    })
  })

  it('case list route should call the case service to fetch case list data', async () => {
    const response = await request(app).get('/cases/2020-01-01')
    expect(caseService.getCaseList).toHaveBeenCalledWith('SHF', '2020-01-01')
    return response
  })

  it('case summary details route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/case/8678951874/details')
    expect(caseService.getCase).toHaveBeenCalledWith('SHF', '8678951874')
    return response
  })

  it('case summary personal details route should call the case service to fetch case data and NOT call the community service if the defendant is not known to probation', async () => {
    caseResponse = {
      probationStatus: 'Not known',
      crn: ''
    }
    const response = await request(app).get('/case/8678951874/details')
    expect(caseService.getCase).toHaveBeenCalledWith('SHF', '8678951874')
    expect(communityService.getPersonalDetails).not.toHaveBeenCalled()
    return response
  })

  it('case summary personal details route should call the community service to fetch probation data when the defendant is known to probation', async () => {
    caseResponse = {
      probationStatus: 'Current',
      crn: 'D985513'
    }
    const response = await request(app).get('/case/8678951874/person')
    expect(caseService.getCase).toHaveBeenCalledWith('SHF', '8678951874')
    expect(communityService.getPersonalDetails).toHaveBeenCalledWith('D985513')
    return response
  })

  // @TODO: Implement tests when completing this section of work and delete this TODO
  it('case summary probation record route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/case/8678951874/record')
    expect(caseService.getCase).toHaveBeenCalledWith('SHF', '8678951874')
    return response
  })

  // @TODO: Implement tests when completing this section of work and delete this TODO
  it('case summary risk registers route should call the case service to fetch case data', async () => {
    const response = await request(app).get('/case/8678951874/risk')
    expect(caseService.getCase).toHaveBeenCalledWith('SHF', '8678951874')
    return response
  })
})
