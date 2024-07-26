import { render } from '@testing-library/react';
import HistopathLandingPage from "@/pages/histopath";
import { createTestQueryClient } from "../../utils";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Histopathology landing page', () => {
  it('renders correctly', () => {
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <HistopathLandingPage />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });
});