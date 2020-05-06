/* global describe, it, expect */
const request = require('supertest')

const app = require('../../app')

describe('Self health check', () => {
  it('GET /ping should return status 200', async () => {
    const response = await request(app).get('/ping')
    expect(response.statusCode).toEqual(200)
    return response
  })
})
