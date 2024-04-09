const createRouter = require('../routes')
const createAttachmentsRouter = require('../routes/attachments')

module.exports = async app => {
  app.use('/', createRouter())
  app.use('/:courtCode/attachments', createAttachmentsRouter())
}