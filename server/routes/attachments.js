const express = require('express')
const { getAttachment } = require('../services/community-service')

module.exports = function Index ({ authenticationMiddleware }) {
  const router = express.Router()

  router.use(authenticationMiddleware())

  router.get('/:crn/documents/:documentId/:documentName', async (req, res, next) => {
    const file = await getAttachment(req.params.crn, req.params.documentId)
    if (file && file.data) {
      res.attachment(req.params.documentName)
      file.data.pipe(res)
    } else {
      next()
    }
  })
  return router
}
