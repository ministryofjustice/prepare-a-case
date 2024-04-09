const ServiceError = require('../services/utils/ServiceError')

// service errors, either hasn't met role requirements or jwt has expired

module.exports = async app => app.use((error, req, res, next) => {
  if (error instanceof ServiceError && [401, 403]
    .includes(error.status)) {
      return res.redirect('/logout')
    }
  next(error)
})
