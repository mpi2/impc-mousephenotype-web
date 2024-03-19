import { findAllByTestId, screen } from '@testing-library/react';
import GeneOrder from '@/components/Gene/Order';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from 'msw';
import Crlf3Data from "../../../mocks/data/genes/MGI:1860086/order.json";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene order component', () => {
  it('should display information', async () => {
    // misuse of query param :) to pass param to fetch function
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(Crlf3Data));
      })
    );
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GeneOrder allelesStudied={[]}/>);
    expect(screen.getByRole('heading')).toHaveTextContent('Order Mouse and ES Cells');
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(8);
  });

  it('should display the correct information for the alleles provided', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(Crlf3Data));
      })
    );
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GeneOrder allelesStudied={["Crlf3<em1(IMPC)Wtsi>", "Crlf3<tm1a(KOMP)Wtsi>", "Crlf3<tm1b(KOMP)Wtsi>"]}/>);
    const rows = await screen.findAllByRole('row');
    // 8 because includes the header
    expect(rows.length).toEqual(8);
    const firstAlleleRow = screen.getByRole('row', { name: "Crlf3 em1(IMPC)Wtsi Deletion Yes mouse" });
    expect(firstAlleleRow).toBeInTheDocument();
    const secondAlleleRow = screen.getByRole('row', {
      name: "Crlf3 tm1a(KOMP)Wtsi KO first allele (reporter-tagged insertion with conditional potential) Yes targeting vector es cell mouse",
    });
    expect(secondAlleleRow).toBeInTheDocument();
    const thirdAlleleRow = screen.getByRole('row', {
      name: "Crlf3 tm1b(KOMP)Wtsi Reporter-tagged deletion allele (with selection cassette) Yes mouse",
    });
    expect(thirdAlleleRow).toBeInTheDocument();
  });

  it('should only display mouse, es cell and targeting vector products', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(Crlf3Data));
      })
    );
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GeneOrder allelesStudied={[]}/>);
    const intermediateCells = screen.queryAllByRole('td', { name: 'intermediate vector'});
    expect(intermediateCells.length).toEqual(0);
    const crisprCells = screen.queryAllByRole('td', { name: 'crispr'});
    expect(crisprCells.length).toEqual(0);
  });

  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    )
    await mockRouter.push('/genes/MGI:1860086?pid=MGI:1860086');
    renderWithClient(<GeneOrder allelesStudied={[]} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No data available for this section.');
  });
});