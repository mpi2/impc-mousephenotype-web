
export type GeneExpressionCounts = {
  ambiguous: number;
  expression: number;
  imageOnly: number;
  noExpression: number;
  tissueNotAvailable: number;
};

export type GeneExpression = {
  controlCounts: GeneExpressionCounts;
  expressionImageParameters: Array<{ parameter_name: string; parameter_stable_id: string; }>;
  lacZLifestage: string;
  mgiGeneAccessionId: string;
  mutantCounts: GeneExpressionCounts;
  parameterName: string;
  parameterStableId: string;
  zygosity: string;
  expressionRate?: number;
  wtExpressionRate?: number;
};