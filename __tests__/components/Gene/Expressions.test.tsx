import { screen } from '@testing-library/react';
import GeneExpressions from '@/components/Gene/Expressions';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";
import { server } from "../../../mocks/server";
import { rest } from 'msw';
import React from "react";
import { GeneContext } from "@/contexts";
import { GeneSummary } from "@/models/gene";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

const gene = {mgiGeneAccessionId: 'MGI:95516', geneSymbol: 'Fgf2'};

describe('Gene expressions component', () => {
  it('should display information', async () => {
    await mockRouter.push('/genes/MGI:95516');
    renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneExpressions />
      </GeneContext.Provider>
    );
    expect(screen.getByRole('heading')).toHaveTextContent('lacZ Expression');
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const adultTabSelector = screen.getByRole('tab', { name: /Adult expressions/ });
    const embryoTabSelector = screen.getByRole('tab', { name: /Embryo expressions/ });
    expect(adultTabSelector).toBeInTheDocument();
    expect(embryoTabSelector).toBeInTheDocument();
    expect(adultTabSelector).toHaveTextContent('Adult expressions (46)');
    expect(embryoTabSelector).toHaveTextContent('Embryo expressions (42)');
  });

  it('should be able to view content from the 2 tabs', async () => {
    const user = userEvent.setup();
    await mockRouter.push('/genes/MGI:95516');
    renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneExpressions />
      </GeneContext.Provider>
    );
    expect(await screen.findByRole('table')).toBeInTheDocument();
    const adultTabSelector = screen.getByRole('tab', { name: /Adult expressions/ });
    const embryoTabSelector = screen.getByRole('tab', { name: /Embryo expressions/ });
    expect(adultTabSelector).toHaveClass('active');
    await user.click(embryoTabSelector);
    expect(embryoTabSelector).toHaveClass('active');
  });

  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:95516/expression`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    )
    await mockRouter.push('/genes/MGI:95516');
    renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneExpressions />
      </GeneContext.Provider>
    );
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No adult expression data available for Fgf2');
  });
});