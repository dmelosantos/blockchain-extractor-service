module.exports = {
  "testMatch": [
    "**/test/**/*.test.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  "collectCoverageFrom": [
    "src/**/*.ts",
  ],
  "coveragePathIgnorePatterns": [
    "<rootDir>/node_modules",
  ],
  "coverageReporters": [
    "json",
    "lcov",
    "text",
  ],
  "coverageThreshold": {
    "global": {
      "branches": 85,
      "functions": 75,
      "lines": 85,
      "statements": 85,
    },
  },
};
