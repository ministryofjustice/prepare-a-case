module.exports = {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  collectCoverage: false,
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
