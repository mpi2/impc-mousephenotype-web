import AllelePage from "@/app/alleles/[pid]/[...alleleSymbol]/allele-page";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import dbn1Tm1aEsCellData from "../../../mocks/data/tests/dbn1-tm1a-es-cell.json";
import dbn1Tm1aMiceData from "../../../mocks/data/tests/dbn1-tm1a-mice.json";
import dbn1Tm1aTvpData from "../../../mocks/data/tests/dbn1-tm1a-tvp.json";
import dbn1Em1MiceData from "../../../mocks/data/tests/dbn1-em1-mice-data.json";
import dbn1Em1CrisprData from "../../../mocks/data/tests/dbn1-em1-crispr-data.json";
import { screen } from "@testing-library/react";

const alleleData = {
  alleleDescription:
    "KO first allele (reporter-tagged insertion with conditional potential)",
  alleleName: "tm1a(KOMP)Wtsi",
  doesCrisprProductsExist: false,
  doesEsCellProductsExist: true,
  doesIntermediateVectorProductsExist: false,
  doesMiceProductsExist: true,
  doesTargetingVectorProductsExist: true,
  emsembleUrl:
    "https://www.ensembl.org/Mus_musculus/Location/View?g=ENSMUSG00000034675",
  geneSymbol: "Dbn1",
  id: "67176b9293943bea03ef2819",
  mgiGeneAccessionId: "MGI:1931838",
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
  useParams: jest.fn().mockImplementation(() => ({
    pid: alleleData.mgiGeneAccessionId,
    alleleSymbol: alleleData.alleleName,
  })),
}));

jest.mock("@/components/GenomeBrowser/GenomeBrowser", () => {
  const GenomeBrowserMock = () => <div>Genome Browser mock</div>;
  return GenomeBrowserMock;
});

describe("Allele page", () => {
  it("renders properly", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/MGI:1931838/tm1a\\(KOMP\\)Wtsi`,
        (_, res, ctx) => {
          return res(ctx.json(dbn1Tm1aEsCellData));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/alleles/mice/get_by_mgi_and_allele_name/MGI:1931838/tm1a\\(KOMP\\)Wtsi`,
        (_, res, ctx) => {
          return res(ctx.json(dbn1Tm1aMiceData));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/alleles/tvp/get_by_mgi_and_allele_name/MGI:1931838/tm1a\\(KOMP\\)Wtsi`,
        (_, res, ctx) => {
          return res(ctx.json(dbn1Tm1aTvpData));
        },
      ),
    );
    const { container } = renderWithClient(
      <AllelePage alleleSymbol="tm1a(KOMP)Wtsi" alleleData={alleleData} />,
    );
    expect(await screen.findByTestId("es-cell-section")).toBeInTheDocument();
    expect(await screen.findByTestId("mice-section")).toBeInTheDocument();
    expect(await screen.findByTestId("tvp-section")).toBeInTheDocument();
    expect(screen.queryByTestId("crispr-section")).toBeNull();
    expect(container).toMatchSnapshot();
  });
  it("renders properly CRISPR section", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/alleles/mice/get_by_mgi_and_allele_name/MGI:1931838/em1\\(IMPC\\)Bay`,
        (req, res, ctx) => {
          return res(ctx.json(dbn1Em1MiceData));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/alleles/crispr/get_by_mgi_and_allele_superscript/MGI:1931838/em1\\(IMPC\\)Bay`,
        (req, res, ctx) => {
          return res(ctx.json(dbn1Em1CrisprData));
        },
      ),
    );
    const { container } = renderWithClient(
      <AllelePage
        alleleSymbol="em1(IMPC)Bay"
        alleleData={{
          ...alleleData,
          alleleName: "em1(IMPC)Bay",
          alleleDescription: "Exon Deletion",
          doesCrisprProductsExist: true,
          doesEsCellProductsExist: false,
          doesIntermediateVectorProductsExist: false,
          doesMiceProductsExist: true,
          doesTargetingVectorProductsExist: false,
        }}
      />,
    );
    expect(await screen.findByTestId("mice-section")).toBeInTheDocument();
    expect(await screen.findByTestId("crispr-section")).toBeInTheDocument();
    expect(screen.queryByTestId("es-cell-section")).toBeNull();
    expect(screen.queryByTestId("tvp-section")).toBeNull();
    expect(container).toMatchSnapshot();
  });
});
