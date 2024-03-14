
export type GeneImage = {
  count: number;
  fileType: string;
  mgiGeneAccessionId: string;
  parameterName: string;
  parameterStableId: string;
  procedureName: string;
  procedureStableId: string;
  strainAccessionId: string;
  thumbnailUrl: string;
}

export type GeneImageCollection = {
  id:                    string;
  mgiGeneAccessionId:    string;
  geneSymbol:            string;
  strainAccessionId:     string;
  pipelineStableId:      string;
  procedureStableId:     string;
  procedureName:         string;
  parameterStableId:     string;
  parameterName:         string;
  biologicalSampleGroup: string;
  images:                Image[];
};

export type Image = {
  thumbnailUrl:         null | string;
  downloadUrl:          string;
  jpegUrl:              string;
  fileType:             string | null;
  observationId:        string;
  specimenId:           string;
  colonyId:             string;
  sex:                  string;
  zygosity:             string;
  ageInWeeks:           number;
  alleleSymbol:         string;
  associatedParameters: AssociatedParameter[] | null;
};

export type AssociatedParameter = {
  stableId:              string;
  associationSequenceId: null | string;
  name:                  string;
  value:                 string;
}