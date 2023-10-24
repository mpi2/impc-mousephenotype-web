import { screen } from '@testing-library/react';
import GeneOrder from '@/components/Gene/Order';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from 'msw';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene order component', () => {
  it('should display information', async () => {
    // misuse of query param :) to pass param to fetch function
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GeneOrder gene={{ geneSymbol: 'Crlf3' }} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Order Mouse and ES Cells');
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(8);
  });


  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    )
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GeneOrder gene={{ geneSymbol: 'Crlf3' }} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No data available for this section.');
  });
});