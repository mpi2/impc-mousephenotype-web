import { render, waitFor } from "@testing-library/react";
import MetabolismLandingPage from "@/app/metabolism/metabolism-page";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { API_URL, createTestQueryClient } from "../../utils";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe("Metabolism landing page", () => {
  it("renders correctly", async () => {
    const client = createTestQueryClient();
    server.use(
      rest.get(`${API_URL}/api/v1/publications`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            content: [],
            first: true,
            last: false,
            number: 0,
            numberOfElements: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
          }),
        );
      }),
    );
    const { container } = render(
      <QueryClientProvider client={client}>
        <MetabolismLandingPage />
      </QueryClientProvider>,
    );
    await waitFor(() => expect(container).toMatchSnapshot());
  });
});
