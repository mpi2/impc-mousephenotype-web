import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./shared/hooks/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "./coverage",
  testPathIgnorePatterns: ["__tests__/utils.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  setupFiles: ["<rootDir>/jest.polyfills.js", "jest-canvas-mock"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^d3-(.+)$": "<rootDir>/node_modules/d3-$1/dist/d3-$1.js",
    "^d3$": "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!(react-markdown|devlop))/"],
};

async function jestConfig() {
  const nextJestConfig = await createJestConfig(config)();
  nextJestConfig.transformIgnorePatterns[0] =
    "/node_modules/(?!(react-markdown|devlop))/";
  return nextJestConfig;
}
export default jestConfig;
