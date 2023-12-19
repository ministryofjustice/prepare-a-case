const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration-tests/fixtures',
  trashAssetsBeforeRuns: true,
  screenshotsFolder: 'integration-tests/screenshots',
  videosFolder: 'integration-tests/videos',
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'test-results/cypress/results-[hash].xml'
  },
  env: {
    TAGS: 'not @ignore'
  },
  taskTimeout: 60000,
  projectId: '2ew2jc',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents (on, config) {
      return require('./integration-tests/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3007',
    specPattern: 'integration-tests/integration/features/**/*.feature',
    excludeSpecPattern: ['*.js', '*.md'],
    supportFile: 'integration-tests/support/index.js'
  }
})
