const express = require('express')
const { getAttachment } = require('../services/community-service')

module.exports = function Index ({ authenticationMiddleware }) {
  const router = express.Router()

  router.use(authenticationMiddleware())

  router.get('/:crn/documents/:documentId/:documentName', async (req, res) => {
    const file = await getAttachment(req.params.crn, req.params.documentId)
    res.setHeader('Content-disposition', file.headers['Content-disposition'])
    res.setHeader('Content-type', file.headers['Content-type'])
    res.send(file.data)
  })
  return router
}
