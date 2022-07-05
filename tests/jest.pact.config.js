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
  testTimeout: 20000
}
