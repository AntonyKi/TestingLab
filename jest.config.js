module.exports = {
  forceExit: true,
  preset: 'ts-jest',
  roots: ['test'],
  testEnvironment: 'node',
  testMatch: ['**/*.(spec|comp|it|e2e).ts'],
};
