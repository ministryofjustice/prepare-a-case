module.exports = {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: './coverage',
  rootDir: '../',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/mock_validation/**',
    '!**/integration-tests/**',
    '!**/coverage/**',
    '!**/tests/**'
  ],
  reporters: [
    'default',
    'jest-junit'
  ],
  testMatch: [
    '/**/?(*.)(spec|test).{js,jsx,mjs}',
    '!/**/integration/**'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!axios)'
  ],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs'
  }
}
