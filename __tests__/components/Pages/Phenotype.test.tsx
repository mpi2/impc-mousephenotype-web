import { screen } from "@testing-library/react";
import PhenotypePage from "@/app/phenotypes/[id]/phenotype-page";
import { API_URL, renderWithClient } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import phenotypeData from "../../../mocks/data/phenotypes/MP:0012361/summary.json";
import phenotypeStatsData from "../../../mocks/data/phenotypes/MP:0012361/phenotype-stats-results.json";
import phenotypeGenotypeHitsData from "../../../mocks/data/phenotypes/MP:0012361/genotype-hits.json";

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
  testServer.use(
    rest.get(
      `${API_URL}/api/v1/phenotypes/MP:0012361/genotype-hits/by-any-phenotype-Id`,
      (req, res, ctx) => {
        return res(ctx.json(phenotypeGenotypeHitsData));
      },
    ),
    rest.get(
      `https://impc-datasets.s3.eu-west-2.amazonaws.com/phenotype-stats-results/dr22.1/MP:0012361.json`,
      (req, res, ctx) => {
        return res(ctx.json(phenotypeStatsData));
      },
    ),
  );

  it("renders correctly", async () => {
    const { container } = renderWithClient(
      <PhenotypePage
        phenotypeId="MP:0012361"
        phenotype={phenotypeData}
        phenotypeHits={[]}
      />,
    );
    expect(await screen.findByLabelText("Manhattan Plot")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
