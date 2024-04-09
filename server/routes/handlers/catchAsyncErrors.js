const logger = require('../../log')

module.exports = handler => async (req, res, next) => {
  try {
    await handler(req, res)
  } catch (e) {
    if (e.config && e.config.headers && e.config.headers.Authorization) {
      e.config.headers.Authorization = '***'
    }
    logger.error(e)
    if (e.isAxiosError) {
      const httpStatus = e.response?.status || 500
      const message = e.response?.data?.developerMessage
      logger.error({ type: 'API Error', code: e.code, URL: e.config?.url, method: e.config?.method, httpStatus, message }, e.toString())
    }
    next(e)
  }
}