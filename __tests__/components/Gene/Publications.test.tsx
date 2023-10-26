import { screen } from '@testing-library/react';
import GenePublications from '@/components/Gene/Publications';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from 'msw';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene publications component', () => {
  it('should display information', async () => {
    // misuse of query param :) to pass param to fetch function
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GenePublications gene={{ geneSymbol: 'Crlf3' }} />);
    expect(screen.getByRole('heading')).toHaveTextContent('IMPC related publications');
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(9);
  });


  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/publication`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    )
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GenePublications gene={{ geneSymbol: 'Crlf3' }} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No publications found that use IMPC mice or data for the Crlf3 gene.');
  });
});