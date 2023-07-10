/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
