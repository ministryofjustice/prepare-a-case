const bunyan = require('bunyan')

module.exports = {
  err: bunyan.stdSerializers.err,
  req(req) {
    const req1 = bunyan.stdSerializers.req(req)
    req1.username = req.user && req.user.username // this has been removed from req1 by the stdSerializer
    return req1
  },
  res(res) {
    const res1 = bunyan.stdSerializers.res(res)
    res1.username = res.locals && res.locals.user && res.locals.user.username
    return res1
  },
}
