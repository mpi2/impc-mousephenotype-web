import { render, screen, waitFor } from '@testing-library/react';
import { AlleleMap } from "@/components/Allele";
import { QueryClientProvider } from "@tanstack/react-query";
import { API_URL, createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";
import { GeneComparatorProvider } from "@/components/GeneComparator";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1AlelleMap from "../../../mocks/data/tests/dbn1-allele-map.json";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Allele Page - Allele Map', () => {
  it('renders correctly', async () => {
    const endpointURL = `${API_URL}/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/MGI:1931838/tm1a(KOMP)Wtsi`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1AlelleMap));
      })
    );

    const client = createTestQueryClient();
    await mockRouter.push('/data/alleles/MGI:1931838/tm1a(KOMP)Wtsi');

    const { container } = render(
      <QueryClientProvider client={client}>
        <GeneComparatorProvider>
          <AlleleMap
            mgiGeneAccessionId="MGI:1931838"
            alleleName="tm1a(KOMP)Wtsi"
            emsembleUrl="https://www.ensembl.org/Mus_musculus/Location/View?g=ENSMUSG00000034675"
          />
        </GeneComparatorProvider>
      </QueryClientProvider>
    );
    await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Allele Map'))
    expect(container).toMatchSnapshot();
  });

  it('displays nothing if data is empty', async () => {
    const endpointURL = `${API_URL}/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/MGI:1931838/tm1a(KOMP)WtsiTest`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    const client = createTestQueryClient();
    await mockRouter.push('/data/alleles/MGI:1931838/tm1a(KOMP)WtsiTest');

    const { container } = render(
      <QueryClientProvider client={client}>
        <GeneComparatorProvider>
          <AlleleMap
            mgiGeneAccessionId="MGI:1931838"
            alleleName="tm1a(KOMP)Test"
            emsembleUrl="https://www.ensembl.org/Mus_musculus/Location/View?g=ENSMUSG00000034675"
          />
        </GeneComparatorProvider>
      </QueryClientProvider>
    );
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});