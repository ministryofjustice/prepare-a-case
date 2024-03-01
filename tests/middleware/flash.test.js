/* global describe, beforeEach, it, expect */
const flash = require('../../server/middleware/flash')

describe('Flash middleware', () => {
  let stubExpress
  beforeEach(() => {
    const req = {
      session: {}
    }
    const res = {}
    const next = () => {}
    stubExpress = { req, res, next }
    flash()(stubExpress.req, stubExpress.res, stubExpress.next)
  })

  it('Should add a flash message', () => {
    stubExpress.req.flash('some-flash-name', 'some-flash-message')
    expect(stubExpress.req.session.flashMessages['some-flash-name']).toEqual('some-flash-message')
  })

  it('Should read and delete a flash message', () => {
    stubExpress.req.flash('some-flash-name', 'some-flash-message')
    expect(stubExpress.req.session.flashMessages['some-flash-name']).toEqual('some-flash-message')

    const message = stubExpress.req.flash('some-flash-name')
    expect(message).toEqual('some-flash-message')

    const message2 = stubExpress.req.flash('some-flash-name')
    expect(message2).toEqual(undefined)
  })

  it('Should clear all messages', () => {
    stubExpress.req.flash('some-flash-name', 'some-flash-message')
    expect(stubExpress.req.session.flashMessages['some-flash-name']).toEqual('some-flash-message')

    stubExpress.req.flash()

    const message2 = stubExpress.req.flash('some-flash-name')
    expect(message2).toEqual(undefined)
  })
})
