module.exports = async app => app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store')
  res.setHeader('Pragma', 'no-cache')
  next()
})