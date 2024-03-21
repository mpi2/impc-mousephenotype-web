import { screen } from '@testing-library/react';
import GeneHistopathology from '@/components/Gene/Histopathology';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from 'msw';
import { GeneSummary } from "@/models/gene";
import { GeneContext } from "@/contexts";
import gls2Data from "../../../mocks/data/genes/MGI:2143539/histopathology.json";

const gene = {mgiGeneAccessionId: 'MGI:2143539', geneSymbol: 'Gls2'};
jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene histopathology component', () => {
  it('should display information', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:2143539/gene_histopathology`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(gls2Data));
      })
    );
    // misuse of query param :) to pass param to fetch function
    await mockRouter.push('/genes/MGI:2143539?pid=MGI:2143539');
    renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneHistopathology />
      </GeneContext.Provider>
    );
    expect(await screen.findByRole('heading')).toHaveTextContent('Histopathology');
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('should show alert with link to histopathology page if there are not significant hist. hits', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:2143539/gene_histopathology`, (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );
    const updatedGene = {...gene, hasHistopathologyData: true};
    await mockRouter.push('/genes/MGI:2143539?pid=MGI:2143539');
    renderWithClient(
      <GeneContext.Provider value={updatedGene as GeneSummary}>
        <GeneHistopathology />
      </GeneContext.Provider>
    );
    expect(await screen.findByRole('link')).toBeInTheDocument();
    expect(await screen.findByRole('link')).toHaveAttribute('href', '/data/histopath/MGI:2143539');
  });


  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:2143539/histopathology`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    )
    await mockRouter.push('/genes/MGI:2143539?pid=MGI:2143539');
    renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneHistopathology />
      </GeneContext.Provider>
    );
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('There is no histopathology data found for Gls2');
  });
});