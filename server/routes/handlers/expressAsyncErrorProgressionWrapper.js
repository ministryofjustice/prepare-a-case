const logger = require('../../../log')

const expressAsyncErrorProgressionWrapper = (handler) => async (req, res, next) => {
  try {
    await handler(req, res)
  } catch (e) {
    logger.error(e)
    let status = e.status || 500
    let message
    if (e.isAxiosError) {
      status = e.response?.status || status
      message = e.response?.data?.developerMessage
      logger.error({ type: 'API Error', code: e.code, URL: e.config?.url, method: e.config?.method, httpStatus: status, message }, e.toString())
    }
    next({ ...e, status })
  }
}

module.exports = expressAsyncErrorProgressionWrapper
