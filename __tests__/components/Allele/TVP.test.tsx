import { render, screen, waitFor } from '@testing-library/react';
import { TVP } from "@/components/Allele";
import { QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { API_URL, createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";
import { GeneComparatorProvider } from "@/components/GeneComparator";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1TVP from "../../../mocks/data/tests/dbn1-tvp.json";
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Allele Page - TVP', () => {
  it('renders correctly', async () => {
    const user = userEvent.setup();
    const endpointURL = `${API_URL}/api/v1/alleles/tvp/get_by_mgi_and_allele_name/MGI:1931838/tm1a(KOMP)Wtsi`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1TVP));
      })
    );
    const client = createTestQueryClient();
    await mockRouter.push('/data/alleles/MGI:1931838/tm1a(KOMP)Wtsi');


    const { container } = render(
      <QueryClientProvider client={client}>
        <GeneComparatorProvider>
          <TVP
            mgiGeneAccessionId="MGI:1931838"
            alleleName="tm1a(KOMP)Wtsi"
          />
        </GeneComparatorProvider>
      </QueryClientProvider>
    );
    await waitFor(() => expect(screen.getByTestId('header')).toHaveTextContent('Targeting vectors'))
    expect(container).toMatchSnapshot();

    expect(screen.getAllByRole('link', { name: "Genbank file" }).length).toBe(3);
    expect(screen.getAllByRole('link', { name: "Vector map" }).length).toBe(3);
    expect(screen.getAllByRole('link', { name: "KOMP" }).length).toBe(3);

  });
});