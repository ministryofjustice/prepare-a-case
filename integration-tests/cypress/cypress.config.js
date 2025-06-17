const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { NodeModulesPolyfillPlugin } = require('@esbuild-plugins/node-modules-polyfill')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { resetStubs, stubSignIn } = require('./mockApis/wiremock')

module.exports = {
  chromeWebSecurity: false,
  fixturesFolder: './output/fixtures',
  trashAssetsBeforeRuns: true,
  screenshotsFolder: './output/screenshots',
  videosFolder: './output/videos',
  reporter: 'junit',
  reporterOptions: {
    mochaFile: './output/test-results/cypress/results-[hash].xml'
  },
  env: {
    TAGS: 'not @ignore'
  },
  taskTimeout: 20000,
  projectId: '2ew2jc',
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'integration-tests/cypress/e2e/**/*.feature',
    excludeSpecPattern: ['*.js', '*.md'],
    supportFile: false,
    setupNodeEvents: async (on, config) => {
      config.env = {
        stepDefinitions: [
          'integration-tests/cypress/e2e/[filepath]/**/*.{js,ts}',
          'integration-tests/cypress/e2e/[filepath].{js,ts}',
          'integration-tests/cypress/support/step_definitions/**/*.{js,ts}'
        ],
        CASES_TOTAL_DAYS: 28
      }
      await addCucumberPreprocessorPlugin(on, config)
      require('cypress-fail-fast/plugin')(on, config)
      on('task', {
        resetStubs,
        stubSignIn,
        log (message) {
          console.log(message)
          return null
        },
        table (message) {
          console.table(message)
          return null
        }
      })
      on(
        'file:preprocessor', createBundler({
          plugins: [NodeModulesPolyfillPlugin(), createEsbuildPlugin(config)]
        })
      )
      return config
    }
  }
}
