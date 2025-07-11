import "@testing-library/jest-dom";
import { renderWithClient } from "../utils";
import GenomeBrowserPage from "@/app/genes/[pid]/genome-browser/genome-browser-page";

const ascc2Summary = {
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

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

jest.mock("igv/dist/igv.esm", () => {
  return {
    __esModule: true,
    default: {
      createBrowser: jest.fn().mockImplementation(() =>
        Promise.resolve({
          search: jest.fn(),
        }),
      ),
    },
  };
});

describe("Genome Browser page", () => {
  it("renders properly", async () => {
    const { container } = renderWithClient(
      <GenomeBrowserPage
        mgiGeneAccessionId={ascc2Summary.mgiGeneAccessionId}
        geneSummary={ascc2Summary}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
