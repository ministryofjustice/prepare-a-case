module.exports = {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: './coverage',
  rootDir: '../',
  collectCoverageFrom: [
    'server/**/*.js'
  ],
  reporters: [
    'default',
    'jest-junit'
  ],
  testMatch: [
    '/**/?(*.)(spec|test).{js,jsx,mjs}',
    '!/**/integration/**'
  ]
}
