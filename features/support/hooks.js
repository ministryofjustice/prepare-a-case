const { After, Before, AfterAll } = require('cucumber')
const scope = require('./scope')

Before(() => {
  require('../../bin/www')
})

After(async () => {
  if (scope.browser && scope.context.currentPage) {
    await scope.context.currentPage.close()
    scope.context.currentPage = null
  }
})

AfterAll(async () => {
  if (scope.browser) {
    await scope.browser.close()
    process.exit(0)
  }
})
