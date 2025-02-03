import { render } from "@testing-library/react";
import PhenotypePage from "@/app/phenotypes/[id]/phenotype-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";
import mockRouter from "next-router-mock";
import phenotypeData from "../../../mocks/data/phenotypes/MP:0012361/summary.json";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Phenotype page", () => {
  it("renders correctly", async () => {
    const client = createTestQueryClient();
    await mockRouter.push("/phenotypes/MP:0001324");
    const { container } = render(
      <QueryClientProvider client={client}>
        <PhenotypePage phenotype={phenotypeData} phenotypeHits={[]} />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
