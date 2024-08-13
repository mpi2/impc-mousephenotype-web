import { screen } from '@testing-library/react';
import AllelePage from "@/pages/alleles/[pid]/[alleleSymbol]";
import { API_URL, renderWithClient } from "../utils";
import mockRouter from "next-router-mock";
import { waitFor } from "@testing-library/react";
import { server } from "../../mocks/server";
import { rest } from "msw";
import dbn1Data from '../../mocks/data/tests/dbn1-alleles.json';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Allele page', () => {
  it('renders correctly', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/alleles/MGI:1931838/tm1a(KOMP)Wtsi`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1Data));
      })
    );
    await mockRouter.push('data/alleles/MGI:1931838/tm1a(KOMP)Wtsi?pid=MGI:1931838&alleleSymbol=tm1a(KOMP)Wtsi');
    mockRouter.isReady = true;
    const { container } = renderWithClient(
      <AllelePage />
    );
    await waitFor(() => screen.getByRole('heading', { level: 1 }));
    expect(container).toMatchSnapshot();
  });
});