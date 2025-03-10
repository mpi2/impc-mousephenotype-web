import nextJest from "next/jest.js";
import tsconfig from "./tsconfig.json" with { type: "json" };
import { pathsToModuleNameMapper } from "ts-jest";

const createJestConfig = nextJest({
  dir: "./",
});

const moduleNameMapper = pathsToModuleNameMapper(
  tsconfig.compilerOptions.paths,
  {
    prefix: "<rootDir>/",
  },
);
moduleNameMapper["^d3-(.+)$"] = "<rootDir>/node_modules/d3-$1/dist/d3-$1.js";
moduleNameMapper["^d3$"] = "<rootDir>/node_modules/d3/dist/d3.min.js";

/** @type {import('jest').Config} */
const config = {
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
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
  moduleNameMapper: moduleNameMapper,
  transformIgnorePatterns: ["/node_modules/(?!(react-markdown|devlop))/"],
};

async function jestConfig() {
  const nextJestConfig = await createJestConfig(config)();
  nextJestConfig.transformIgnorePatterns[0] =
    "/node_modules/(?!(react-markdown|devlop))/";
  return nextJestConfig;
}
export default jestConfig;
