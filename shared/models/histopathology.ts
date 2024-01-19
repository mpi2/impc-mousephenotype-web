
export type HistopathologyResponse = {
  id: string;
  mgiGeneAccessionId: string;
  datasets: Array<{
    tissue: string;
    observations: Array<{
      alleleAccessionId: string;
      alleleSymbol: string;
      externalSampleId: string;
      lifeStageName: string;
      parameterName: string;
      parameterStableId: string;
      phenotypingCenter: string;
      pipelineStableId: string;
      procedureStableId: string;
      specimenId: string;
      tissue: string;
      zygosity: string;
      ontologyTerms: Array<{ termId: string; termName: string }>
    }>
  }>
}

export type Histopathology = {
  alleleAccessionId: string;
  alleleSymbol: string;
  lifeStageName: string;
  specimenId: string;
  specimenNumber: string;
  tissue: string;
  zygosity: string;
  maTerm: string;
  mPathProcessTerm: string;
  severityScore: string;
  significanceScore: string;
}