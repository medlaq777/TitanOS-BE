export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  rootDir: "./",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/services/**/*.js"
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85
    }
  },
  testMatch: [
    "**/tests/**/*.test.js"
  ]
};
