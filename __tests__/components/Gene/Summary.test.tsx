import { screen, act } from "@testing-library/react";
import Summary from "@/components/Gene/Summary";
import { renderWithClient } from "../../utils";
import { GeneSummary } from "@/models/gene";
import { summarySystemSelectionChannel } from "@/eventChannels";
import userEvent from "@testing-library/user-event";
import { GeneContext } from "@/contexts";

let gene: GeneSummary = {
  geneName: "calcium and integrin binding family member 2",
  geneSymbol: "Cib2",
  mgiGeneAccessionId: "MGI:1929293",
  synonyms: ["calcium binding protein Kip2", "2810434I23Rik"],
  significantPhenotypesCount: 25,
  notSignificantTopLevelPhenotypes: [
    "reproductive system phenotype",
    "integument phenotype",
    "adipose tissue phenotype",
    "growth/size/body region phenotype",
    "muscle phenotype",
    "cardiovascular system phenotype",
    "craniofacial phenotype",
    "renal/urinary system phenotype",
    "pigmentation phenotype",
    "limbs/digits/tail phenotype",
    "vision/eye phenotype",
    "skeleton phenotype",
    "mortality/aging",
  ],
  significantTopLevelPhenotypes: [
    "homeostasis/metabolism phenotype",
    "immune system phenotype",
    "hearing/vestibular/ear phenotype",
    "nervous system phenotype",
    "hematopoietic system phenotype",
    "behavior/neurological phenotype",
  ],
  hasLacZData: true,
  hasImagingData: true,
  hasViabilityData: true,
  hasBodyWeightData: true,
  hasEmbryoImagingData: false,
  hasHistopathologyData: false,
  alleleNames: [],
  assignmentStatus: "",
  associatedDiseasesCount: 0,
  humanGeneSymbols: [],
  humanSymbolSynonyms: [],
  id: "GENE-0001",
};

describe("Gene summary component", () => {
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });
  it("displays physiological systems correctly", async () => {
    renderWithClient(
      <GeneContext.Provider value={gene}>
        <Summary numOfAlleles={5} />
      </GeneContext.Provider>,
    );
    expect(screen.getByTestId("totalCount")).toHaveTextContent(
      "19 / 24 physiological systems tested",
    );
    expect(screen.getByTestId("significantSystemIcons").children).toHaveLength(
      6,
    );
    expect(screen.getByTestId("significantCount")).toHaveTextContent("6");
    expect(
      screen.getByTestId("notSignificantSystemIcons").children,
    ).toHaveLength(13);
    expect(screen.getByTestId("nonSignificantCount")).toHaveTextContent("13");
    expect(screen.getByTestId("notTestedSystemIcons").children).toHaveLength(5);
    expect(screen.getByTestId("nonTestedCount")).toHaveTextContent("5");
  });

  it("displays data collection status correctly", () => {
    renderWithClient(
      <GeneContext.Provider value={gene}>
        <Summary numOfAlleles={5} />
      </GeneContext.Provider>,
    );
    expect(screen.getByTestId("LacZ expression")).not.toHaveClass(
      "dataCollectionInactive",
    );
    expect(screen.getByTestId("Histopathology")).toHaveClass(
      "dataCollectionInactive",
    );
    expect(screen.getByTestId("Images")).not.toHaveClass(
      "dataCollectionInactive",
    );
    expect(screen.getByTestId("Body weight measurements")).not.toHaveClass(
      "dataCollectionInactive",
    );
    expect(screen.getByTestId("Viability data")).not.toHaveClass(
      "dataCollectionInactive",
    );
    expect(screen.getByTestId("Embryo imaging data")).toHaveClass(
      "dataCollectionInactive",
    );
  });

  it("should have synonyms tooltip if have 3 or more", () => {
    renderWithClient(
      <GeneContext.Provider value={{ ...gene, synonyms: ["1", "2", "3", "4"] }}>
        <Summary numOfAlleles={5} />
      </GeneContext.Provider>,
    );
    expect(screen.getByTestId("synonyms")).toBeDefined();
  });

  it("should display the number of alleles inside the button", async () => {
    renderWithClient(
      <GeneContext.Provider value={gene}>
        <Summary numOfAlleles={5} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("button")).toHaveTextContent(
      "5 Allele products available",
    );
    expect(await screen.findByRole("button")).toHaveAttribute("href", "#order");
  });

  it("should display the number of alleles inside the button", async () => {
    const spy = jest.spyOn(summarySystemSelectionChannel, "emit");
    const user = userEvent.setup();
    renderWithClient(
      <GeneContext.Provider value={gene}>
        <Summary numOfAlleles={5} />
      </GeneContext.Provider>,
    );
    await act(async () => {
      await user.click(await screen.findByText(/Nervous system/i));
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "onSystemSelection",
      "nervous system phenotype",
    );
    await act(async () => {
      await user.click(await screen.findByText(/Hematopoietic system/i));
    });
    expect(spy).toHaveBeenCalledWith(
      "onSystemSelection",
      "hematopoietic system phenotype",
    );
  });
});
