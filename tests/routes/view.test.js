/* global describe, beforeEach, afterEach, it, expect, jest */
const moxios = require('moxios')
const request = require('supertest')

const defaults = require('../../routes/middleware/defaults')
const healthcheck = require('../../routes/middleware/healthcheck')

let app

describe('Routes', () => {
  jest.spyOn(healthcheck, 'health').mockImplementation(function (req, res, next) {
    return next()
  })

  jest.spyOn(defaults, 'defaults').mockImplementation(function (req, res, next) {
    req.params.courtCode = 'SHF'
    req.params.courtName = 'Sheffield Magistrates\' Court'
    req.params.apiUrl = 'http://court_case_service.url'
    return next()
  })

  beforeEach(() => {
    moxios.install()
    app = require('../../app')
  })

  afterEach(() => {
    moxios.uninstall()
    jest.clearAllMocks()
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

  it('case list route should call the API to fetch case list data', async () => {
    moxios.stubRequest('http://court_case_service.url/court/SHF/cases?date=2020-01-01', {
      status: 200,
      response: {
        data: {
          cases: []
        }
      }
    })

    const response = await request(app).get('/cases/2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe('http://court_case_service.url/court/SHF/cases?date=2020-01-01')
    return response
  })

  it('should fail silently if the case list API is down', async () => {
    moxios.stubRequest('http://court_case_service.url/court/SHF/cases?date=2020-01-01', {
      status: 500
    })

    const response = await request(app).get('/cases/2020-01-01')
    expect(moxios.requests.mostRecent().url).toBe('http://court_case_service.url/court/SHF/cases?date=2020-01-01')
    return response
  })

  it('case summary route should call the API to fetch case data', async () => {
    moxios.stubRequest('http://court_case_service.url/court/SHF/case/8678951874', {
      status: 200,
      response: {
        data: ''
      }
    })

    const response = await request(app).get('/case/8678951874/details')
    expect(moxios.requests.mostRecent().url).toBe('http://court_case_service.url/court/SHF/case/8678951874')
    return response
  })

  it('should fail silently if the case list API is down', async () => {
    moxios.stubRequest('http://court_case_service.url/court/SHF/case/8678951874', {
      status: 500
    })

    const response = await request(app).get('/case/8678951874/details')
    expect(moxios.requests.mostRecent().url).toBe('http://court_case_service.url/court/SHF/case/8678951874')
    return response
  })
})
