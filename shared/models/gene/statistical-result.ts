import { PhenotypeRef } from "@/models/phenotype-ref";

export type GeneStatisticalResult = {
  mgiGeneAccessionId: string;
  pipelineStableId:   string;
  procedureStableId:  string;
  procedureName:      string;
  parameterStableId:  string;
  parameterName:      string;
  alleleAccessionId:  string;
  alleleName:         string;
  alleleSymbol:       string;
  metadataGroup:      string;
  zygosity:           string;
  phenotypingCentre:  string;
  projectName:        string;
  maleMutantCount:    number;
  femaleMutantCount:  number;
  lifeStageName:      string;
  pValue:             null | string;
  significant:        boolean;
  phenotype:          PhenotypeRef;
  topLevelPhenotypes: PhenotypeRef[] | null;
}