/* global describe, beforeEach, afterEach, it, expect, jest */
const request = require('supertest')
const healthcheck = require('../../routes/middleware/healthcheck')

let app

describe('Routes', () => {
  jest.spyOn(healthcheck, 'health').mockImplementation(function (req, res, next) {
    return next()
  })

  beforeEach(() => {
    app = require('../../app')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('default route should return status 200', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toEqual(200)
    })
  })

  it('case list route should return status 200', () => {
    return request(app).get('/case-list').then(response => {
      expect(response.statusCode).toEqual(200)
    })
  })
})
