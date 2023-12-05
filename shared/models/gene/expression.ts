
type Counts = {
  ambiguous: number;
  expression: number;
  imageOnly: number;
  noExpression: number;
  tissueNotAvailable: number;
};

export type GeneExpression = {
  controlCounts: Counts;
  expressionImageParameters: Array<{ parameter_name: string; parameter_stable_id: string; }>;
  lacZLifestage: string;
  mgiGeneAccessionId: string;
  mutantCounts: Counts;
  parameterName: string;
  parameterStableId: string;
  zygosity: string;
  expressionRate?: number;
  wtExpressionRate?: number;
};