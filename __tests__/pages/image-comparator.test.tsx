import SearchResults from "@/pages/search";
import { screen } from '@testing-library/react';
import { renderWithClient } from "../utils";
import { server } from "../../mocks/server";
import { rest } from "msw";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Image comparator', () => {
  it('displays images on both columns', async () => {

  });
});