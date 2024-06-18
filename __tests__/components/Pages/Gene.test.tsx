import { render } from '@testing-library/react';
import GenePage from "@/pages/genes/[pid]";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";
import { GeneComparatorProvider } from "@/components/GeneComparator";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Gene page', () => {
  it('renders correctly', async () => {
    const client = createTestQueryClient();
    await mockRouter.push('/genes/MGI:1336993');
    const { container } = render(
      <QueryClientProvider client={client}>
        <GeneComparatorProvider>
          <GenePage />
        </GeneComparatorProvider>
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});