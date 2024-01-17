import '@testing-library/jest-dom';
import { server } from "./mocks/server";
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());