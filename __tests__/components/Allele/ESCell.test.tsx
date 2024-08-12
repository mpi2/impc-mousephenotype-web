import { render, screen, waitFor } from '@testing-library/react';
import { ESCell } from "@/components/Allele";
import { QueryClientProvider } from "@tanstack/react-query";
import { API_URL, createTestQueryClient, renderWithClient } from "../../utils";
import mockRouter from "next-router-mock";
import { GeneComparatorProvider } from "@/components/GeneComparator";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1EsCell from "../../../mocks/data/tests/dbn1-escell.json";
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Allele Page - ESCell', () => {
  it('renders correctly', async () => {
    const user = userEvent.setup();
    const endpointURL = `${API_URL}/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/MGI:1931838/tm1a(KOMP)Wtsi`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1EsCell));
      })
    );

    const client = createTestQueryClient();
    await mockRouter.push('/data/alleles/MGI:1931838/tm1a(KOMP)Wtsi');
    const qcDataFn = jest.fn();

    const { container } = render(
      <QueryClientProvider client={client}>
        <GeneComparatorProvider>
          <ESCell
            mgiGeneAccessionId="MGI:1931838"
            alleleName="tm1a(KOMP)Wtsi"
            setQcData={qcDataFn}
          />
        </GeneComparatorProvider>
      </QueryClientProvider>
    );
    await waitFor(() => expect(screen.getByTestId('header')).toBeDefined())
    expect(container).toMatchSnapshot();

    await user.click(screen.getByRole('link', { name: "View" }));
    expect(qcDataFn).toHaveBeenCalledWith([{
      "userQc": {
        "threePrimeLrPcr": "pass"
      }
    }]);
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
      <ESCell
        mgiGeneAccessionId="MGI:1931838"
        alleleName="tm1a(KOMP)WtsiTest"
        setQcData={qcDataFn}
      />
    );
    await waitFor(() => expect(screen.getByTestId('no-results-alert')).toBeDefined());
  });
});