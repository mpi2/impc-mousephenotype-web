import { screen } from '@testing-library/react';
import GeneHistopathology from '@/components/Gene/Histopathology';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from 'msw';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene expressions component', () => {
  it('should display information', async () => {
    // misuse of query param :) to pass param to fetch function
    await mockRouter.push('/genes/MGI:2143539?pid=MGI:2143539');
    renderWithClient(<GeneHistopathology gene={{ geneSymbol: 'Gls2' }} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Histopathology');
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });


  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:2143539/histopathology`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    )
    await mockRouter.push('/genes/MGI:2143539?pid=MGI:2143539');
    renderWithClient(<GeneHistopathology gene={{ geneSymbol: 'Gls2' }} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('There is no histopathology data found for Gls2');
  });
});