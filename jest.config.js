const files = `<rootDir>/test/unit/modules/*${
  process.env.TEST_ENV ? `-${process.env.TEST_ENV}-` : ``
}*.js`;

module.exports = {
  automock: false,
  setupFiles: [
    "./test/setupJest.js"
  ],
  verbose: true,
  bail: true,
  testMatch: [files],
  testEnvironment: process.env.TEST_ENV || 'jsdom'
};
