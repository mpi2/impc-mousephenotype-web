
export type GenePhenotypeHits = {
  alleleAccessionId: string;
  alleleName: string;
  alleleSymbol: string;
  datasetId: string;
  effectSize: number;
  intermediatePhenotypes: Array<{ id: string; name: string; }>;
  lifeStageName: string;
  mgiGeneAccessionId: string;
  pValue: number;
  parameterName: string;
  parameterSatableId: string;
  phenotype: { id: string; name: string; };
  phenotypingCentre: string;
  pipelineStableId: string;
  procedureName: string;
  procedureStableId: string;
  projectName: string;
  sex: string;
  topLevelPhenotypes: Array<{ id: string; name: string; }>;
  zygosity: string;
}