import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jest-environment-jsdom',
    collectCoverage: true,
    collectCoverageFrom: [
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    coverageDirectory: './coverage',
    testPathIgnorePatterns: [
        "__tests__/utils.tsx",
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    setupFiles: ['<rootDir>/jest.polyfills.js', "jest-canvas-mock"],
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/pages/(.*)$': '<rootDir>/pages/$1',
        '^@/utils/(.*)$': '<rootDir>/utils/$1',
        '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
        '^d3-color$': '<rootDir>/node_modules/d3-color/dist/d3-color.js',
    }
}
export default createJestConfig(config)