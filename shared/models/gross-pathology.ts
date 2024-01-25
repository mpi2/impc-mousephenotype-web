
export type GrossPathologyDataset = {
  alleleAccessionId: string;
  alleleSymbol: string;
  dataPoint: null;
  externalSampleId: string;
  lifeStageName: string;
  ontologyTerms: Array<{ termId: string; termName: string }>;
  parameterName: string;
  phenotypingCenter: string;
  pipelineStableId: string;
  procedureStableId: string;
  textValue: null;
  zygosity: string;
};

export type GrossPathology = {
  id: string;
  mgiGeneAccessionId: string;
  parameterStableId: string;
  datasets: Array<GrossPathologyDataset>
}