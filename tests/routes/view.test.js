const request = require('supertest')
const app = require('../../app')

describe('Routes', () => {
  it('default route should return status 200', () => {
    return request(app).get('/').then(res => {
      expect(res.statusCode).toEqual(200)
    })
  })

  it('case list route should return status 200', () => {
    return request(app).get('/case-list').then(res => {
      expect(res.statusCode).toEqual(200)
    })
  })
})
