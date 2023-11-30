
export type PhenotypeSearchResponseItem = {
  entityId: string;
  entityProperties: {
    definition: string;
    geneCount: string;
    intermediateLevelParents: string;
    mpId: string;
    phenotypeName: string;
    synonyms: string;
    topLevelParents: string;
  }
};

export type PhenotypeSearchResponse = {
  numResults: number;
  results: Array<PhenotypeSearchResponseItem>;
}