const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('dashboard', { title: 'Dashboard' })
})

router.get('/case-list', function (req, res) {
  res.render('case-list', { title: 'Case list' })
})

module.exports = router
