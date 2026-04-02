/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.js"],
  transform: {},
  moduleFileExtensions: ["js"],
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};
