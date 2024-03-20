import renderer from 'react-test-renderer';
import ImagesCompare from "@/pages/genes/[pid]/images/[parameterStableId]";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Image comparator page', () => {
  it('renders correctly', async () => {
    const client = createTestQueryClient();
    await mockRouter.push('/genes/MGI:1931838/images/IMPC_XRY_048_001');
    const tree = renderer.create(
      <QueryClientProvider client={client}>
        <ImagesCompare />
      </QueryClientProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});