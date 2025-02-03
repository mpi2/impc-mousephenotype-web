import { render, waitFor } from "@testing-library/react";
import SexualDimorphismLandingPage from "@/app/sexual-dimorphism/sexual-dimorphism-page";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { API_URL, createTestQueryClient } from "../../utils";
import { QueryClientProvider } from "@tanstack/react-query";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe("Sexual dimorphism landing page", () => {
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
        <SexualDimorphismLandingPage />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
