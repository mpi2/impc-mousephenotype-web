import { screen, waitFor } from "@testing-library/react";
import GenePublications from "@/components/Gene/Publications";
import { renderWithClient, API_URL } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import { GeneContext } from "@/contexts";
import pubData from "../../../mocks/data/tests/crlf3-pub-data.json";

describe("Gene publications component", () => {
  it("should display information", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1860086/publication`,
        (req, res, ctx) => {
          return res(ctx.json(pubData));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GenePublications />
      </GeneContext.Provider>,
    );
    expect(screen.getByRole("heading")).toHaveTextContent(
      "IMPC related publications",
    );
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(10);
  });

  it("should show an error message if the request fails", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1860086/publication`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GenePublications />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No publications found that use IMPC mice or data for the Crlf3 gene.",
    );
  });
});
