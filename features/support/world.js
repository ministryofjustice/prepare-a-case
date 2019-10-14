const { setWorldConstructor } = require('cucumber')
const puppeteer = require('puppeteer')
const scope = require('./scope')

const World = function () {
  scope.host = `http://127.0.0.1:${ process.env.PORT || '3000' }`
  scope.driver = puppeteer
  scope.context = {}
}

setWorldConstructor(World)
