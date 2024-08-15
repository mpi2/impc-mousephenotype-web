import { screen } from '@testing-library/react';
import DownloadImagesPage from "@/pages/genes/[pid]/download-images/[parameterStableId]";
import { API_URL, renderWithClient } from "../utils";
import mockRouter from "next-router-mock";
import { waitFor } from "@testing-library/react";
import { server } from "../../mocks/server";
import { rest } from "msw";
import dbn1MutantImages from '../../mocks/data/tests/dbn1-mutant-dl-images.json';
import dbn1ControlImages from '../../mocks/data/tests/dbn1-control-dl-images.json';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Download images page', () => {
  it('renders correctly', async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=MGI:1931838&parameterStableId=JAX_ERG_028_001`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1MutantImages));
      })
    );
    server.use(
      rest.get(`${API_URL}/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=JAX_ERG_028_001`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1ControlImages));
      })
    );
    await mockRouter.push('data/genes/MGI:1931838/download-images/JAX_ERG_028_001?pid=MGI:1931838&parameterStableId=JAX_ERG_028_001');
    const { container } = renderWithClient(
      <DownloadImagesPage />
    );
    await waitFor(() => screen.getByRole('heading', { level: 1 }));
    expect(container).toMatchSnapshot();
  });
});