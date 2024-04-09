module.exports = async app => app.use((req, res, next) => {
  next(new HttpError(404))
})
