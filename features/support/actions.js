const pages = require('./pages')
const scope = require('./scope')

let headless = true
let slowMo = (process.env.CIRCLECI) ? 0 : 5

const delay = duration => new Promise(resolve => setTimeout(resolve, duration))

const openApp = async () => {
  if (!scope.browser) {
    scope.browser = await scope.driver.launch({ headless, slowMo })
  }
  scope.context.currentPage = await scope.browser.newPage()
  scope.context.currentPage.setViewport({ width: 1280, height: 1024 })
  const url = scope.host + pages.dashboard
  return await scope.context.currentPage.goto(url, {
    waitUntil: 'networkidle2'
  })
}

const navigateToPage = async pageName => {
  const url = scope.host + pages[pageName]
  return await scope.context.currentPage.goto(url, {
    waitUntil: 'networkidle2'
  })
}

const shouldBeOnPage = async pageTitle => {
  await scope.context.currentPage.waitForSelector('H1')
  const textContent = await scope.context.currentPage.evaluate(() => document.getElementsByTagName('h1')[0].textContent)
  if (textContent !== pageTitle) {
    throw new Error(`Expected page to have heading: ${ text }, but has: ${ content }`)
  }
}

const shouldSeeText = async text => {
  const { currentPage } = scope.context
  const content = await currentPage.content()
  if (!content.includes(text)) {
    throw new Error(`Expected page to contain text: ${ text }, but page contains only: ${ content }`)
  }
}

module.exports = {
  openApp,
  navigateToPage,
  shouldBeOnPage,
  shouldSeeText
}
