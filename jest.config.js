/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: true,
  coverageDirectory: 'coverage',
};

module.exports = config;
