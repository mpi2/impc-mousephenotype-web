
type SummaryStatistics = {
  bothMutantCount:    number;
  bothMutantMean:     number;
  bothMutantSd:       number;
  femaleControlCount: number;
  femaleControlMean:  number;
  femaleControlSd:    number;
  femaleMutantCount:  number;
  femaleMutantMean:   number;
  femaleMutantSd:     number;
  maleControlCount:   number;
  maleControlMean:    number;
  maleControlSd:      number;
  maleMutantCount:    number;
  maleMutantMean:     number;
  maleMutantSd:       number;
};
type StatisticalMethod = {
  method: string;
  attributes: {
    femaleEffectSize:                number | null;
    femaleKoEffectPValue:            number;
    femaleKoEffectStderrEstimate:    number;
    femaleKoParameterEstimate:       number;
    femalePercentageChange:          number | null;
    maleKoEffectPValue:              number;
    maleKoEffectStderrEstimate:      number;
    maleKoParameterEstimate:         number;
    malePercentageChange:            number | null;
    genotypeEffectPValue:            number;
    genotypeEffectStderrEstimate:    number;
    group1Genotype:                  string;
    group1ResidualsNormalityTest:    number;
    group2Genotype:                  string;
    group2ResidualsNormalityTest:    number;
    interactionEffectPValue:         number | null;
    interactionSignificant:          boolean | null;
    interceptEstimate:               number;
    interceptEstimateStderrEstimate: number;
    maleEffectSize:                  number | null;
    sexEffectPValue:                 number | null;
    sexEffectParameterEstimate:      number | null;
    sexEffectStderrEstimate:         number | null;
    batchSignificant:                boolean;
    varianceSignificant:             boolean;
  }
}

export type Dataset = {
  id:                     string;
  alleleAccessionId:      string;
  alleleName:             string;
  alleleSymbol:           string;
  colonyId:               string;
  dataType:               string;
  geneSymbol:             string;
  geneticBackground:      string;
  intermediatePhenotypes: Array<{ name: string, id: string }>;
  lifeStageAcc:           string;
  lifeStageName:          string;
  metadataGroup:          string;
  metadataValues:         Array<string>;
  mgiGeneAccessionId:     string;
  parameterName:          string;
  parameterStableId:      string;
  parameterStableKey:     number;
  phenotypeSex:           Array<string>;
  phenotypingCentre:      string;
  pipelineName:           string;
  pipelineStableId:       string;
  pipelineStableKey:      number;
  procedureGroup:         string;
  procedureName:          string;
  procedureStableId:      string;
  procedureStableKey:     number;
  productionCentre:       string;
  projectName:            string;
  reportedEffectSize:     number;
  reportedPValue:         number;
  resourceFullName:       string;
  resourceName:           string;
  sex:                    string;
  zygosity:               string;
  significant:            boolean;
  significantPhenotype:   { name: string, id: string };
  datasetId:              string;
  status:                 string;
  strainAccessionId:      string;
  strainName:             string;
  summaryStatistics:      SummaryStatistics;
  statisticalMethod:      StatisticalMethod;
  topLevelPhenotypes:     Array<{ name: string, id: string }>;
}