import SearchResults from "@/app/search/search-page";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { GeneComparatorProvider } from "@/components/GeneComparator";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import geneSearchResults from "../../mocks/data/tests/gene-search-results-data.json";
import phenotypeSearchResults from "../../mocks/data/tests/phenotype-search-results-data.json";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

describe("Search Results", () => {
  it("renders default title", () => {
    testServer.use(
      rest.get(`${API_URL}/api/search/v1/search`, (req, res, ctx) => {
        const type = req.url.searchParams.get("type");
        return res(
          ctx.json(
            type === "PHENOTYPE" ? phenotypeSearchResults : geneSearchResults,
          ),
        );
      }),
    );
    renderWithClient(
      <GeneComparatorProvider>
        <SearchResults
          data={{ numResults: 0, results: [] }}
          type={""}
          term={""}
        />
      </GeneComparatorProvider>,
    );
    const heading = screen.getByRole("heading", {
      name: /Gene search results/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders phenotype title based on query", () => {
    testServer.use(
      rest.get(`${API_URL}/api/search/v1/search`, (req, res, ctx) => {
        const type = req.url.searchParams.get("type");
        return res(
          ctx.json(
            type === "PHENOTYPE" ? phenotypeSearchResults : geneSearchResults,
          ),
        );
      }),
    );
    renderWithClient(
      <GeneComparatorProvider>
        <SearchResults
          data={{ numResults: 0, results: [] }}
          type="pheno"
          term=""
        />
      </GeneComparatorProvider>,
    );
    const heading = screen.getByRole("heading", {
      name: /Phenotype search results/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
