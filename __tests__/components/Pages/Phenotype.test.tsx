import { render } from '@testing-library/react';
import PhenotypePage from "@/pages/phenotypes/[id]";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Phenotype page', () => {
  it('renders correctly', async () => {
    const client = createTestQueryClient();
    await mockRouter.push('/phenotypes/MP:0001324');
    const {container} = render(
      <QueryClientProvider client={client}>
        <PhenotypePage />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});