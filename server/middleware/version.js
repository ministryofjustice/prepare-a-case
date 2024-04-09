module.exports = async (app, config) => app.use((req, res, next) => {

  res.locals.appVersion = config.appVersion
})