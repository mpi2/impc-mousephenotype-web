import renderer from 'react-test-renderer';
import PhenotypePage from "@/pages/phenotypes/[id]";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Phenotype page', () => {
  it('renders correctly', async () => {
    const client = createTestQueryClient();
    await mockRouter.push('/phenotypes/MP:0001324');
    const tree = renderer.create(
      <QueryClientProvider client={client}>
        <PhenotypePage />
      </QueryClientProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});