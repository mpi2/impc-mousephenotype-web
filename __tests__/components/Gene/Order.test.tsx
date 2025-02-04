import { screen } from "@testing-library/react";
import GeneOrder from "@/components/Gene/Order";
import { renderWithClient, API_URL } from "../../utils";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import Crlf3Data from "../../../mocks/data/genes/MGI:1860086/order.json";
import { GeneContext } from "@/contexts";

describe("Gene order component", () => {
  it("should display information", async () => {
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GeneOrder
          orderDataFromServer={Crlf3Data}
          allelesStudied={[]}
          allelesStudiedLoading={true}
        />
      </GeneContext.Provider>,
    );
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Order Mouse and ES Cells",
    );
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(10);
  });

  it("should display the correct information for the alleles provided", async () => {
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GeneOrder
          orderDataFromServer={Crlf3Data}
          allelesStudied={[
            "Crlf3<em1(IMPC)Wtsi>",
            "Crlf3<tm1a(KOMP)Wtsi>",
            "Crlf3<tm1b(KOMP)Wtsi>",
          ]}
          allelesStudiedLoading={true}
        />
      </GeneContext.Provider>,
    );
    const rows = await screen.findAllByRole("row");
    // 9 because includes the header
    expect(rows.length).toEqual(10);
    const firstAlleleRow = screen.getByRole("row", {
      name: "Crlf3 em1(IMPC)Wtsi Deletion ‌ mouse",
    });
    expect(firstAlleleRow).toBeInTheDocument();
    const secondAlleleRow = screen.getByRole("row", {
      name: "Crlf3 tm1a(KOMP)Wtsi KO first allele (reporter-tagged insertion with conditional potential) ‌ targeting vector ES Cell mouse",
    });
    expect(secondAlleleRow).toBeInTheDocument();
    const thirdAlleleRow = screen.getByRole("row", {
      name: "Crlf3 tm1b(KOMP)Wtsi Reporter-tagged deletion allele (with selection cassette) ‌ mouse",
    });
    expect(thirdAlleleRow).toBeInTheDocument();
  });

  it("should only display mouse, es cell and targeting vector products", async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(Crlf3Data));
      }),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GeneOrder
          orderDataFromServer={Crlf3Data}
          allelesStudied={[]}
          allelesStudiedLoading={true}
        />
      </GeneContext.Provider>,
    );
    const intermediateCells = screen.queryAllByRole("td", {
      name: "intermediate vector",
    });
    expect(intermediateCells.length).toEqual(0);
    const crisprCells = screen.queryAllByRole("td", { name: "crispr" });
    expect(crisprCells.length).toEqual(0);
  });

  it("should show an error message if the request fails", async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1860086/order`, (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Crlf3", mgiGeneAccessionId: "MGI:1860086" }}
      >
        <GeneOrder
          orderDataFromServer={[]}
          allelesStudied={[]}
          allelesStudiedLoading={true}
        />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No data available for this section.",
    );
  });
});
