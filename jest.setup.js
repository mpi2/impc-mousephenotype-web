import "@testing-library/jest-dom";
import { testServer } from "./mocks/server";
import { loadEnvConfig } from "@next/env";

global.IS_REACT_ACT_ENVIRONMENT = true;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

beforeAll(() => testServer.listen());
afterEach(() => testServer.resetHandlers());
afterAll(() => testServer.close());
