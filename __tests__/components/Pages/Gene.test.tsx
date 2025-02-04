import { render } from "@testing-library/react";
import GenePage from "@/app/genes/[pid]/gene-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
  useParams: jest.fn().mockImplementation(() => ({ pid: "MGI:1922702" })),
}));

describe("Gene page", () => {
  it("renders correctly", async () => {
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <GenePage
          gene={{ mgiGeneAccessionId: "MGI:1922702", geneSymbol: "Ascc2" }}
        />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
