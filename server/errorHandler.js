const logger = require('../log.js')

const moment = require('moment')

exports.notFound = (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
}

exports.developmentErrors = (error, req, res, next) => {
  logger.error(error)
  error.stack = error.stack || ''
  const errorDetails = {
    message: error.message,
    status: error.status,
    stack: error.stack
  }
  res.status(error.status || 500)
  res.format({
    'text/html': () => {
      res.render('error', errorDetails)
    },
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  })
}

exports.productionErrors = (error, req, res, next) => {
  logger.error(error)
  res.status(error.status || 500)
  res.render('error', {
    status: error.status,
    maintenanceDate: moment().add(1, 'days').format("dddd D MMMM")
})
}
