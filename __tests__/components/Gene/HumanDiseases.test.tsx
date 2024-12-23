import { screen } from '@testing-library/react';
import GeneHumanDiseases from '@/components/Gene/HumanDiseases';
import { renderWithClient, API_URL } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from 'msw';
import userEvent from "@testing-library/user-event";
import otogData from '../../../mocks/data/genes/MGI:1202064/disease.json';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene human diseases component', () => {
  it('should display information', async () => {
    // misuse of query param :) to pass param to fetch function
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1202064/disease`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(otogData));
      })
    );
    await mockRouter.push('/genes/MGI:1202064?pid=MGI:1202064');
    renderWithClient(<GeneHumanDiseases gene={{ geneSymbol: 'Otog' }} />);
    expect(await screen.findByRole('heading')).toHaveTextContent('Human diseases caused by Otog mutations');
    const assocDiseasesTab = await screen.findByRole('tab', { name: /Human diseases associated/ });
    const predictedDiseasesTab = await screen.findByRole('tab', { name: /Human diseases predicted/ });
    expect(assocDiseasesTab).toBeInTheDocument();
    expect(predictedDiseasesTab).toBeInTheDocument();
  });

  it('should be able to view content from the 2 tabs', async () => {
    const user = userEvent.setup();
    await mockRouter.push('/genes/MGI:1922546?pid=MGI:1922546');
    renderWithClient(<GeneHumanDiseases gene={{ geneSymbol: 'Cep43' }} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    const assocDiseasesTab = screen.getByRole('tab', { name: /Human diseases associated/ });
    const predictedDiseasesTab = screen.getByRole('tab', { name: /Human diseases predicted/ });
    expect(assocDiseasesTab).toHaveClass('active');
    await user.click(predictedDiseasesTab);
    expect(predictedDiseasesTab).toHaveClass('active');
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });


  it('should show an error message if the request fails', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1922546/disease`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    await mockRouter.push('/genes/MGI:1922546?pid=MGI:1922546');
    renderWithClient(<GeneHumanDiseases gene={{ geneSymbol: 'Cep43' }} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No data available for this section');
  });
});