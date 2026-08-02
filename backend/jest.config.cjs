/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        module: { type: "commonjs" },
        jsc: { target: "es2022", parser: { syntax: "typescript" } },
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/src/tests/env.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/db.setup.ts"],
  testTimeout: 30000,
  clearMocks: true,
};
