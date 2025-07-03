import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import * as React from "react";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

export type AppRouterContextProviderMockProps = {
  router?: Partial<AppRouterInstance>;
  children: React.ReactNode;
};

export const TEST_DATASETS_ENDPOINT =
  process.env.NEXT_PUBLIC_STATS_DATASETS_URL;

export const TEST_LANDING_PAGE_ENDPOINT =
  process.env.NEXT_PUBLIC_LANDING_PAGE_DATA_URL;

export const TEST_MH_PLOT_ENDPOINT = process.env.NEXT_PUBLIC_MH_PLOT_DATA_URL;

export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
export function renderWithClient(ui: React.ReactElement) {
  const client = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>,
      ),
  };
}
export const createQueryWrapper = () => {
  const client = createTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

export const AppRouterContextProviderMock = ({
  router,
  children,
}: AppRouterContextProviderMockProps): React.ReactNode => {
  const mockedRouter: AppRouterInstance = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    ...router,
  };
  return (
    <AppRouterContext.Provider value={mockedRouter}>
      {children}
    </AppRouterContext.Provider>
  );
};
