/* global jest, describe, beforeEach, afterEach, it, expect */
const request = require('supertest')
const redis = require('redis')
const redisMock = require('redis-mock')

let app

jest.spyOn(redis, 'createClient').mockImplementation(redisMock.createClient)

describe('Self health check', () => {
  beforeEach(() => {
    app = require('../../app')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('GET /ping should return status 200', () => {
    return request(app).get('/ping').then(res => {
      expect(res.statusCode).toEqual(200)
    })
  })
})
