export default {
  transform: {},
  rootDir: "./",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/services/**/*.js"
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  testMatch: [
    "**/tests/**/*.test.js"
  ]
};
