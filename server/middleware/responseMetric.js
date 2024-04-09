module.exports = async app => app.use((req, res, next) => {

  const start = Date().now()
  res.on('finish', () => {
    const time = Date().now() - start
    process.emitWarning(
      `${req.method} ${req.protocol} ${req.url} ${req.requestId} ${time}ms`
      ,'Perf'
    )
  })
  next()
})
