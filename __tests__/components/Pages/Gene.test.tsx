import { render } from "@testing-library/react";
import GenePage from "@/app/genes/[pid]/gene-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { API_URL, createTestQueryClient } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
  useParams: jest.fn().mockImplementation(() => ({ pid: "MGI:1922702" })),
}));

describe("Gene page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/disease/json`,
        (req, res, ctx) => {
          return res(ctx.json([]));
        },
      ),
    );
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <GenePage
          gene={{ mgiGeneAccessionId: "MGI:1922702", geneSymbol: "Ascc2" }}
          significantPhenotypes={[]}
          orderData={[]}
          expressionData={[]}
          imageData={[]}
          histopathologyData={[]}
          humanDiseasesData={[]}
        />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
