import { screen } from '@testing-library/react';
import PublicationsPage from "@/pages/publications";
import { API_URL, renderWithClient } from "../utils";
import mockRouter from "next-router-mock";
import { waitFor } from "@testing-library/react";
import { server } from "../../mocks/server";
import { rest } from "msw";
import pubsByConsortium from '../../mocks/data/tests/publications/publications_by_consortium.json';
import aggregationData from '../../mocks/data/tests/publications/aggregation.json';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Publications page', () => {
  it('renders correctly', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/publications/by_consortium_paper?consortiumPaper=true&page=0&size=10`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(pubsByConsortium));
      })
    );
    server.use(
      rest.get(`${API_URL}/api/v1/publications/aggregation`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(aggregationData));
      })
    );
    await mockRouter.push('data/publications');
    const { container } = renderWithClient(
      <PublicationsPage />
    );
    await waitFor(() => expect(screen.getAllByRole('table').length).toEqual(2));
    expect(container).toMatchSnapshot();
  });
});