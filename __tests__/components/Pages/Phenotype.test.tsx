import { render, screen } from "@testing-library/react";
import PhenotypePage from "@/app/phenotypes/[id]/phenotype-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import phenotypeData from "../../../mocks/data/phenotypes/MP:0012361/summary.json";
import phenotypeStatsData from "../../../mocks/data/phenotypes/MP:0012361/phenotype-stats-results.json";

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
}));

describe("Phenotype page", () => {
  server.use(
    rest.get(
      `https://impc-datasets.s3.eu-west-2.amazonaws.com/phenotype-stats-results/dr22.1/MP:0012361.json`,
      (req, res, ctx) => {
        return res(ctx.json(phenotypeStatsData));
      },
    ),
  );

  it("renders correctly", async () => {
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <PhenotypePage
          phenotypeId="MP:0012361"
          phenotype={phenotypeData}
          phenotypeHits={[]}
        />
      </QueryClientProvider>,
    );
    expect(await screen.findByLabelText("Manhattan Plot")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
