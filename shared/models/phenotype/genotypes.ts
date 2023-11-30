export type PhenotypeGenotypes = {
  alleleAccessionId: string;
  alleleName: string;
  alleleSymbol: string;
  datasetId: string;
  effectSize: number;
  intermediatePhenotypes: Array<{ id: string | null; name: string; }>;
  lifeStageName: string;
  mgiGeneAccessionId: string;
  pValue: number | null;
  parameterName: string;
  parameterStableId: string;
  phenotype: { id: string | null; name: string; };
  phenotypingCentre: string;
  pipelineStableId: string;
  procedureName: string;
  procedureStableId: string;
  projectName: string;
  sex: string;
  topLevelPhenotypes: Array<{ id: string | null; name: string; }>;
  zygosity: string;
}