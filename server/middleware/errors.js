module.exports = async (app, config) => app.use((error, req, res) => {
  const status = error.status || 500
  process.emitWarning(error, status >= 500? 'Error' : 'Warning', 'RootErrorHandler')
  const errorDetails = {
    message: error.message,
    status,
    stack: error.stack,
    maintenanceDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    isEnvDevelopment: !config.isProduction
  }
  res.status(status)
  res.format({
    'text/html': () => {
      res.render('error', errorDetails)
    },
    'application/json': () => res.json(errorDetails)
  })
})