/* global describe, it, expect */
const request = require('supertest')
const app = require('../../app')

describe('Self health check', () => {
  it('GET /ping should return status 200', () => {
    return request(app).get('/ping').then(res => {
      expect(res.statusCode).toEqual(200)
    })
  })
})
