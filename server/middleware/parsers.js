const cookieParser = require('cookie-parser')
const express = require('express')

module.exports = async app => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
}