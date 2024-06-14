import { render } from '@testing-library/react';
import ImagesCompare from "@/pages/genes/[pid]/images/[parameterStableId]";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Image comparator page', () => {
  it('renders correctly', async () => {
    const client = createTestQueryClient();
    await mockRouter.push('/genes/MGI:1931838/images/IMPC_XRY_048_001');
    const { container } = render(
      <QueryClientProvider client={client}>
        <ImagesCompare />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});