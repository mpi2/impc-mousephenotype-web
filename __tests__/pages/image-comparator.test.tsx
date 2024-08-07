import ImagesCompare from "@/pages/genes/[pid]/images/[parameterStableId]";
import { screen, waitFor } from '@testing-library/react';
import { API_URL, renderWithClient } from "../utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import cib2ControlImages from '../../mocks/data/tests/cib2-control-images.json';
import cib2MutantImages from '../../mocks/data/tests/cib2-mutant-images.json';
import mockRouter from "next-router-mock";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Image comparator', () => {
  it('displays images on both columns', async () => {
    const mutantImagesURL = `${API_URL}/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=MGI:1929293&parameterStableId=IMPC_ELZ_064_001`;
    const controlImagesURL = `${API_URL}/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=IMPC_ELZ_064_001`;
    server.use(
      rest.get(mutantImagesURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(cib2MutantImages));
      })
    );
    server.use(
      rest.get(controlImagesURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(cib2ControlImages));
      })
    );
    await mockRouter.push('/data/genes/MGI:1929293/images/IMPC_ELZ_064_001');
    renderWithClient(<ImagesCompare />);
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Embryo LacZ / LacZ images wholemount')
    );
    expect(screen.getAllByRole('presentation').length).toBe(14);
  });
});