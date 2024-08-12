import { screen, waitFor } from '@testing-library/react';
import { Mice } from "@/components/Allele";
import { API_URL, renderWithClient } from "../../utils";
import mockRouter from "next-router-mock";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1Mice from "../../../mocks/data/tests/dbn1-mice.json";
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Allele Page - Mice', () => {
  beforeEach(async () => {
    const endpointURL = `${API_URL}/api/v1/alleles/mice/get_by_mgi_and_allele_name/MGI:1931838/tm1a(KOMP)Wtsi`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1Mice));
      })
    );

    await mockRouter.push('/data/alleles/MGI:1931838/tm1a(KOMP)Wtsi');
  });
  it('renders table with 5 columns when is Crispr', async () => {
    const user = userEvent.setup();

    const qcDataFn = jest.fn();

    const { container} = renderWithClient(
      <Mice
        mgiGeneAccessionId="MGI:1931838"
        alleleName="tm1a(KOMP)Wtsi"
        isCrispr
        setQcData={qcDataFn}
      />
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(container).toMatchSnapshot();

    await user.click(screen.getByRole('link', { name: "View" }));
    expect(qcDataFn).toHaveBeenCalledWith([{
      "productionQc": {
        "tvBackboneAssay": "pass",
        "fivePrimeCassetteIntegrity": "pass",
        "neoCountQpcr": "pass",
        "loaQpcr": "pass",
        "laczSrPcr": "pass",
        "mutantSpecificSrPcr": "pass",
        "loxpConfirmation": "pass",
        "fivePrimeLrPcr": "fail",
        "homozygousLoaSrPcr": "pass",
        "threePrimeLrPcr": "pass"
      }
    }]);
    expect(screen.getAllByRole('columnheader').length).toBe(5);
  });

  it('renders table with 6 columns when is an ESCell', async () => {
    const qcDataFn = jest.fn();

    renderWithClient(
      <Mice
        mgiGeneAccessionId="MGI:1931838"
        alleleName="tm1a(KOMP)Wtsi"
        isCrispr={false}
        setQcData={qcDataFn}
      />
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(screen.getAllByRole('columnheader').length).toBe(6);
  });

  it('displays its empty state when there is no data', async() => {
    const qcDataFn = jest.fn();

    const endpointURL = `${API_URL}/api/v1/alleles/mice/get_by_mgi_and_allele_name/MGI:1931838/tm1a(KOMP)WtsiTest`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    renderWithClient(
      <Mice
        mgiGeneAccessionId="MGI:1931838"
        alleleName="tm1a(KOMP)WtsiTest"
        isCrispr={false}
        setQcData={qcDataFn}
      />
    );
    await waitFor(() => expect(screen.getByTestId('no-results-alert')).toBeDefined());
  });
});