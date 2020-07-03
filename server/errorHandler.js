const logger = require('../log.js')

const production = process.env.NODE_ENV === 'production'

module.exports = (error, req, res) => {
  logger.error(error)

  res.locals.error = error
  res.locals.stack = production ? null : error.stack
  res.locals.message = production ? 'Something went wrong. The error has been logged. Please try again' : error.message

  res.status(error.status || 500)

  res.render('error')
}
