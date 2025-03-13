import { screen } from "@testing-library/react";
import GeneHistopathology from "@/components/Gene/Histopathology";
import { renderWithClient, API_URL } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import { GeneSummary } from "@/models/gene";
import { GeneContext } from "@/contexts";
import gls2Data from "../../../mocks/data/genes/MGI:2143539/histopathology.json";

const gene = {
  mgiGeneAccessionId: "MGI:2143539",
  geneSymbol: "Gls2",
  hasHistopathologyData: true,
};

describe("Gene histopathology component", () => {
  it("should display information", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:2143539/gene_histopathology`,
        (req, res, ctx) => {
          return res(ctx.json(gls2Data));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneHistopathology initialData={gls2Data} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("heading")).toHaveTextContent(
      "Histopathology",
    );
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("should show alert with link to histopathology page if there are not significant hits", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:2143539/gene_histopathology`,
        (req, res, ctx) => {
          return res(ctx.status(404));
        },
      ),
    );
    const updatedGene = { ...gene, hasHistopathologyData: true };
    renderWithClient(
      <GeneContext.Provider value={updatedGene as GeneSummary}>
        <GeneHistopathology initialData={[]} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", {
        name: "Click here to see the raw data",
      }),
    ).toHaveAttribute("href", "/supporting-data/histopath/MGI:2143539");
  });

  it("should show an error message if the request fails", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:2143539/gene_histopathology`,
        (req, res, ctx) => {
          return res(ctx.status(404));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider value={{ ...gene, hasHistopathologyData: false }}>
        <GeneHistopathology initialData={[]} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "There is no histopathology data found for Gls2",
    );
  });
});
