module.exports = {
  testEnvironment: 'node',
  verbose: true,
  rootDir: '../',
  testMatch: [
    '**/*.test.pact.(ts|js)'
  ],
  watchPathIgnorePatterns: [
    'pact/logs/*',
    'pact/pacts/*'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!axios)'
  ],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs'
  },
  testTimeout: 20000
}
