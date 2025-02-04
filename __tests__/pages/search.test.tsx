import SearchResults from "@/app/search/search-page";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithClient } from "../utils";
import { GeneComparatorProvider } from "@/components/GeneComparator";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

describe("Search Results", () => {
  it("renders default title", () => {
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
