module.exports = {
  rootDir: '../../',
  verbose: true,
  testEnvironment: 'node',
  testResultsProcessor: './node_modules/jest-junit-reporter',
  testRegex: './(src|test|.githooks)/.+\\.spec\\.jsx?$',
  modulePaths: ['<rootDir>'],
  testPathIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: ['./test/apiResponses/setup.js'],
}
