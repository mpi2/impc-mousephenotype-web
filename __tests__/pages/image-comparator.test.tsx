import ImagesCompare from "@/pages/genes/[pid]/images/[parameterStableId]";
import { screen, waitFor } from '@testing-library/react';
import { API_URL, renderWithClient } from "../utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import dbn1ControlImages from '../../mocks/data/tests/dbn1-control-images.json';
import cib2MutantImages from '../../mocks/data/tests/dbn1-mutant-images.json';
import mockRouter from "next-router-mock";
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Image comparator', () => {
  it('displays images on both columns, filters can be used', async () => {
    const user = userEvent.setup();
    const mutantImagesURL = `${API_URL}/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=MGI:1931838&parameterStableId=IMPC_ALZ_075_001`;
    const controlImagesURL = `${API_URL}/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=IMPC_ALZ_075_001`;
    server.use(
      rest.get(mutantImagesURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(cib2MutantImages));
      })
    );
    server.use(
      rest.get(controlImagesURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1ControlImages));
      })
    );
    await mockRouter.push('/data/genes/MGI:1931838/images/IMPC_ALZ_075_001');
    renderWithClient(<ImagesCompare />);
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Adult LacZ / LacZ Images Section')
    );
    // in this page, only the images have alt="", use that to get all
    expect(screen.getAllByAltText('').length).toBe(39);
    // click on sex filter
    await user.click(screen.getByTestId('filter-badge-female-sex'));
    await waitFor(() => expect(screen.getAllByAltText('').length).toBe(20));

    await user.click(screen.getByTestId('filter-badge-hom'));
    await waitFor(() => expect(screen.getAllByAltText('').length).toBe(5));
    expect(screen.getByTestId('col-mutant-images').textContent).toBe("No images to show");

    await user.click(screen.getByTestId('filter-badge-both-sexes'));
    await user.click(screen.getByTestId('filter-badge-all-zygosities'));
    await waitFor(() => expect(screen.getAllByAltText('').length).toBe(39));
    expect(screen.getByTestId('container-mutant-images-0')).toHaveClass("active");
    expect(screen.getByTestId('container-control-images-0')).toHaveClass("active");

    expect(screen.getByTestId('container-mutant-images-6')).not.toHaveClass("active");
    await user.click(screen.getByTestId('container-mutant-images-6'));
    expect(screen.getByTestId('container-mutant-images-6')).toHaveClass("active");
  });
});