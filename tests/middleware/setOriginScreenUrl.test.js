/* global describe, it, expect */
const { setOriginScreenUrl } = require('../../server/middleware/setOriginScreenUrl')

const buildReq = (method, originalUrl) => ({
  method,
  originalUrl,
  session: {}
})

describe('setOriginScreenUrl middleware', () => {
  it('captures the outcomes list screen url', async () => {
    const req = buildReq('GET', '/B14LO/outcomes/in-progress?page=3')
    await setOriginScreenUrl(req, {}, () => {})
    expect(req.session.originScreenUrl).toEqual('/B14LO/outcomes/in-progress?page=3')
  })

  it('captures the cases list screen url', async () => {
    const req = buildReq('GET', '/B14LO/cases?page=1')
    await setOriginScreenUrl(req, {}, () => {})
    expect(req.session.originScreenUrl).toEqual('/B14LO/cases?page=1')
  })

  it('captures the case-search screen url', async () => {
    const req = buildReq('GET', '/case-search?term=smith')
    await setOriginScreenUrl(req, {}, () => {})
    expect(req.session.originScreenUrl).toEqual('/case-search?term=smith')
  })

  it('does not capture the toggle-hearing-outcome-required action url', async () => {
    const req = buildReq('GET', '/B14LO/outcomes/hearing/123/defendant/456/toggle-hearing-outcome-required?hearingOutcomeRequired=false')
    await setOriginScreenUrl(req, {}, () => {})
    expect(req.session.originScreenUrl).toBeUndefined()
  })

  it('does not capture the move-to-resulted action url', async () => {
    const req = buildReq('GET', '/B14LO/outcomes/hearing/123/defendant/456/move-to-resulted')
    await setOriginScreenUrl(req, {}, () => {})
    expect(req.session.originScreenUrl).toBeUndefined()
  })

  it('does not overwrite an existing originScreenUrl for non-GET requests', async () => {
    const req = buildReq('POST', '/B14LO/outcomes')
    req.session.originScreenUrl = '/existing'
    await setOriginScreenUrl(req, {}, () => {})
    expect(req.session.originScreenUrl).toEqual('/existing')
  })
})
