import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render} from "@testing-library/react";
import * as React from 'react';

export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})
export function renderWithClient(ui: React.ReactElement) {
  const client = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) => rerender(
      <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>
    ),
  }
}