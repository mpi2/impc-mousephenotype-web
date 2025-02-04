import { render } from "@testing-library/react";
import PhenotypePage from "@/app/phenotypes/[id]/phenotype-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import phenotypeData from "../../../mocks/data/phenotypes/MP:0012361/summary.json";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

describe("Phenotype page", () => {
  it("renders correctly", async () => {
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <PhenotypePage
          phenotypeId="MP:0001324"
          phenotype={phenotypeData}
          phenotypeHits={[]}
        />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
