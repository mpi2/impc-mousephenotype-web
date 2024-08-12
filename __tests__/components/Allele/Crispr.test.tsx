import { render, screen, waitFor } from '@testing-library/react';
import { Crispr } from "@/components/Allele";
import { QueryClientProvider } from "@tanstack/react-query";
import { API_URL, createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";
import { GeneComparatorProvider } from "@/components/GeneComparator";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1Crispr from "../../../mocks/data/tests/dbn1-crispr.json";
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Allele Page - Crispr', () => {
  it('renders correctly', async () => {
    const user = userEvent.setup();
    const endpointURL = `${API_URL}/api/v1/alleles/crispr/get_by_mgi_and_allele_superscript/MGI:1931838/em1(IMPC)Bay`;
    server.use(
      rest.get(endpointURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(dbn1Crispr));
      })
    );

    const client = createTestQueryClient();
    await mockRouter.push('/data/alleles/MGI:1931838/em1(IMPC)Bay');

    document.execCommand = jest.fn();

    const { container } = render(
      <QueryClientProvider client={client}>
        <GeneComparatorProvider>
          <Crispr
            mgiGeneAccessionId="MGI:1931838"
            alleleName="em1(IMPC)Bay"
          />
        </GeneComparatorProvider>
      </QueryClientProvider>
    );
    await waitFor(() => expect(screen.getByTestId('header')).toHaveTextContent('Sequence'))
    expect(container).toMatchSnapshot();

    await user.click(screen.getByRole('button', { name: "Copy"}));
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });
});