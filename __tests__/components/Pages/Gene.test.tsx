import { screen, waitFor, act, within } from "@testing-library/react";
import GenePage from "@/app/genes/[pid]/gene-page";
import { API_URL, renderWithClient } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";

import ascc2StatsRes from "../../../mocks/data/tests/gene/ascc2-stats-result-page.json";
import ascc2DatasetFilterRes from "../../../mocks/data/tests/gene/ascc2-dataset-filter.json";
import ascc2PhenHits from "../../../mocks/data/tests/gene/ascc2-phenotype-hits.json";
import ascc2Expression from "../../../mocks/data/tests/gene/ascc2-expression.json";
import ascc2Images from "../../../mocks/data/tests/gene/ascc2-images.json";
import ascc2Histopathology from "../../../mocks/data/tests/gene/ascc2-gene-histopathology.json";
import ascc2Publications from "../../../mocks/data/tests/gene/ascc2-publications.json";
import ascc2Order from "../../../mocks/data/tests/gene/ascc2-order.json";
import externalLinksProviders from "../../../mocks/data/tests/gene/ascc2-external-links-providers.json";
import ascc22ExternalLinks from "../../../mocks/data/tests/gene/ascc2-external-links.json";

const ascc2Summary = {
  _id: "67fd234962c00fab963d9b11",
  id: "MGI:1922702",
  mgiGeneAccessionId: "MGI:1922702",
  geneName: "activating signal cointegrator 1 complex subunit 2",
  geneSymbol: "Ascc2",
  markerType: "Gene",
  synonyms: ["1700011I11Rik", "ASC1p100", "2610034L15Rik"],
  humanGeneSymbols: ["ASCC2"],
  humanSymbolSynonyms: ["FLJ21588", "ASC1p100", "DKFZp586O0223"],
  productionCentres: ["BCM"],
  phenotypingCentres: ["BCM"],
  alleleNames: [
    "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "endonuclease-mediated mutation 11, GemPharmatech Co., Ltd",
    "endonuclease-mediated mutation 1, GemPharmatech Co., Ltd",
    "targeted mutation 1b, Wellcome Trust Sanger Institute",
  ],
  isUmassGene: false,
  isIdgGene: false,
  analysisDownloadUrl: null,
  embryoAnalysisViewUrl: null,
  centre: null,
  colonyId: null,
  hasAutomatedAnalysis: null,
  mgi: null,
  proceduresParameters: null,
  url: null,
  embryoAnalysisViewName: null,
  embryoModalities: null,
  hasEmbryoImagingData: false,
  chrName: "11",
  seqRegionStart: "4587747",
  seqRegionEnd: "4635699",
  chrStrand: "+",
  seqRegionId: "11",
  entrezgeneId: null,
  ensemblGeneIds: null,
  ccdsIds: null,
  ncbiId: null,
  assignmentStatus: "Selected for production",
  nullAlleleProductionStatus: "Genotype confirmed mice",
  conditionalAlleleProductionStatus: "Genotype confirmed mice",
  crisprAlleleProductionStatus: null,
  crisprConditionalAlleleProductionStatus: null,
  esCellProductionStatus: "ES Cells Produced",
  mouseProductionStatus: "Mice Produced",
  phenotypingStatus: "Phenotyping All Data Sent",
  phenotypeStatus: "Phenotyping data available",
  phenotypingDataAvailable: true,
  significantTopLevelPhenotypes: [
    "homeostasis/metabolism phenotype",
    "immune system phenotype",
    "growth/size/body region phenotype",
    "hematopoietic system phenotype",
    "behavior/neurological phenotype",
    "mortality/aging",
    "cardiovascular system phenotype",
  ],
  notSignificantTopLevelPhenotypes: [
    "reproductive system phenotype",
    "integument phenotype",
    "adipose tissue phenotype",
    "muscle phenotype",
    "hearing/vestibular/ear phenotype",
    "craniofacial phenotype",
    "pigmentation phenotype",
    "embryo phenotype",
    "limbs/digits/tail phenotype",
    "nervous system phenotype",
    "vision/eye phenotype",
    "respiratory system phenotype",
    "liver/biliary system phenotype",
    "skeleton phenotype",
  ],
  significantPhenotypesCount: 7,
  adultExpressionObservationsCount: 49,
  embryoExpressionObservationsCount: 62,
  associatedDiseasesCount: 0,
  hasLacZData: true,
  hasImagingData: true,
  hasHistopathologyData: true,
  hasViabilityData: true,
  hasBodyWeightData: true,
};

type RequestMock = {
  url: string;
  resFn: (req, res, ctx) => Promise<any>;
};

const mockRequestMapper: Array<RequestMock> = [
  {
    url: `${API_URL}/api/v1/genes/statistical-result/filtered/page`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2StatsRes)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/dataset/get_filter_data`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2DatasetFilterRes)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/phenotype-hits`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2PhenHits)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/expression`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Expression)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/images`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Images)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/gene_histopathology`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Histopathology)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/publication`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Publications)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/order`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Order)),
  },
  {
    url: `${API_URL}/api/v1/genes/gene_external_links/providers`,
    resFn: (_, res, ctx) => res(ctx.json(externalLinksProviders)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/disease/json`,
    resFn: (_, res, ctx) => res(ctx.json([])),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/gene_external_links`,
    resFn: (_, res, ctx) => res(ctx.json(ascc22ExternalLinks)),
  },
];

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
  useParams: jest.fn().mockImplementation(() => ({ pid: "MGI:1922702" })),
}));

jest.mock("framer-motion", () => {
  const FakeTransition = jest
    .fn()
    .mockImplementation(({ children }) => children);
  const FakeAnimatePresence = jest
    .fn()
    .mockImplementation(({ children }) => (
      <FakeTransition>{children}</FakeTransition>
    ));
  const LayoutGroup = jest
    .fn()
    .mockImplementation(({ children }) => <>{children}</>);
  const motion = {
    a: jest.fn().mockImplementation(({ children }) => <a>{children}</a>),
  };
  return {
    __esModule: true,
    motion,
    AnimatePresence: FakeAnimatePresence,
    default: jest.fn(),
    LayoutGroup,
  };
});

describe("Gene page", () => {
  it("renders correctly", async () => {
    testServer.use(
      ...mockRequestMapper.map(({ url, resFn }) => rest.get(url, resFn)),
    );
    const { container } = renderWithClient(
      <GenePage
        gene={ascc2Summary}
        significantPhenotypes={[]}
        orderData={[]}
        expressionData={[]}
        imageData={[]}
        histopathologyData={[]}
        humanDiseasesData={[]}
      />,
    );
    await act(async () => await new Promise(process.nextTick));
    await waitFor(async () => {
      const rows = await screen.findAllByRole("table");
      return expect(rows.length).toEqual(7);
    });
    const externalLinksTable = screen.getByRole("table", {
      name: "External links table",
    });
    await waitFor(async () => {
      expect(within(externalLinksTable).getAllByRole("row")).toHaveLength(2);
    });
    expect(container).toMatchSnapshot();
  });
});
