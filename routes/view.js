const express = require('express')
const router = express.Router()
const { health } = require('./middleware/healthcheck')

router.get('/', health, function (req, res) {
  res.render('dashboard', { title: 'Dashboard', healthy: req.healthy })
})

router.get('/case-list', health, function (req, res) {
  res.render('case-list', { title: 'Case list', healthy: req.healthy })
})

module.exports = router
