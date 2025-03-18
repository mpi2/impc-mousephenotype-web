import { screen } from "@testing-library/react";
import GeneImages from "@/components/Gene/Images";
import { renderWithClient, API_URL } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import { GeneContext } from "@/contexts";
import imageData from "../../../mocks/data/tests/crlf3-images-data.json";

describe("Gene images component", () => {
  it("should display information", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1860086/images`,
        (req, res, ctx) => {
          return res(ctx.json(imageData));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GeneImages initialData={[]} />
      </GeneContext.Provider>,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Associated images");
    expect(await screen.findAllByTestId("image")).toHaveLength(8);
  });

  it("should show an error message if the request fails", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1860086/images`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );
    // await mockRouter.push("/genes/MGI:1860086?pid=MGI:1860086");
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GeneImages initialData={[]} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "There are no images available for Crlf3.",
    );
  });
});
