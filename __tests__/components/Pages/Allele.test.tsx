import AllelePage from "@/app/alleles/[pid]/[...alleleSymbol]/allele-page";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../../utils";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1Tm1aEsCellData from "../../../mocks/data/tests/dbn1-tm1a-es-cell.json";
import dbn1Tm1aMiceData from "../../../mocks/data/tests/dbn1-tm1a-mice.json";
import dbn1Tm1aTvpData from "../../../mocks/data/tests/dbn1-tm1a-tvp.json";

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

jest.mock("igv/dist/igv.esm");

describe("AllelePage", () => {
  it("renders properly", () => {
    server.use(
      rest.get(
        `${API_URL}/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/${alleleData.mgiGeneAccessionId}/${alleleData.alleleName}`,
        (req, res, ctx) => {
          return res(ctx.json(dbn1Tm1aEsCellData));
        },
      ),
    );
    server.use(
      rest.get(
        `${API_URL}/api/v1/alleles/mice/get_by_mgi_and_allele_name/${alleleData.mgiGeneAccessionId}/${alleleData.alleleName}`,
        (req, res, ctx) => {
          return res(ctx.json(dbn1Tm1aMiceData));
        },
      ),
    );
    server.use(
      rest.get(
        `${API_URL}/api/v1/alleles/tvp/get_by_mgi_and_allele_name/${alleleData.mgiGeneAccessionId}/${alleleData.alleleName}`,
        (req, res, ctx) => {
          return res(ctx.json(dbn1Tm1aTvpData));
        },
      ),
    );
    renderWithClient(
      <AllelePage alleleSymbol="tm1a(KOMP)Wtsi" alleleData={alleleData} />,
    );
  });
});
