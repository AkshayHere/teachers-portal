/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^prisma/(.*)$": "<rootDir>/prisma/$1",
    "^controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^schemas/(.*)$": "<rootDir>/src/schemas/$1",
  },
};
