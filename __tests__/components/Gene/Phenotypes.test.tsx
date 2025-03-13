import { screen, waitFor } from "@testing-library/react";
import GenePhenotypes from "@/components/Gene/Phenotypes/index";
import { renderWithClient, API_URL } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import { GeneContext } from "@/contexts";
import { GeneSummary } from "@/models/gene";
import allPhenData from "../../../mocks/data/tests/myo6-all-data-paged.json";
import filterData from "../../../mocks/data/tests/myo6-filter-data.json";
import phenHitsData from "../../../mocks/data/tests/myo6-phenotype-hits-data.json";

jest.mock("next/navigation", () => {
  const routerMock = {
    back: jest.fn(),
    push: jest.fn(),
  };
  return {
    useRouter: jest.fn().mockImplementation(() => routerMock),
    useSearchParams: jest.fn().mockImplementation(
      () =>
        new URLSearchParams({
          mgiGeneAccessionId: "MGI:1922730",
          mpTermId: "MP:0011100",
        }),
    ),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
  };
});

const gene = { mgiGeneAccessionId: "MGI:104785", geneSymbol: "Myo6" };
const FILTER_DATA_ENDPOINT = `${API_URL}/api/v1/genes/MGI:104785/dataset/get_filter_data`;
const ALL_DATA_ENDPOINT = `${API_URL}/api/v1/genes/statistical-result/filtered/page`;
const PHENOTYPE_HITS_ENDPOINT = `${API_URL}/api/v1/genes/MGI:104785/phenotype-hits`;

describe("Gene phenotypes component", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(FILTER_DATA_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(filterData));
      }),
      rest.get(ALL_DATA_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(allPhenData));
      }),
      rest.get(PHENOTYPE_HITS_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(phenHitsData));
      }),
    );
    const { container } = renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GenePhenotypes sigPhenotypesFromServer={phenHitsData} />
      </GeneContext.Provider>,
    );
    await waitFor(() => {
      expect(screen.getAllByRole("table").length).toBe(2);
    });
    expect(container).toMatchSnapshot();
  });
});
