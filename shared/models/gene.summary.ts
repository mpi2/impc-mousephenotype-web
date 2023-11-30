
export type GeneSummary = {
  adultExpressionObservationsCount?: number;
  alleleNames: Array<string>;
  assignmentStatus: string;
  associatedDiseasesCount: number;
  embryoExpressionObservationsCount?: number;
  geneName: string;
  geneSymbol: string;
  hasBodyWeightData: boolean;
  hasEmbryoImagingData: boolean;
  hasImagingData: boolean;
  hasHistopathologyData: boolean;
  hasLacZData: boolean;
  hasViabilityData: boolean;
  humanGeneSymbols: Array<string>;
  humanSymbolSynonyms: Array<string>;
  id: string;
  mgiGeneAccessionId: string;
  notSignificantTopLevelPhenotypes: Array<string>;
  significantPhenotypesCount: number;
  significantTopLevelPhenotypes: Array<string>;
  synonyms: Array<string>;
};