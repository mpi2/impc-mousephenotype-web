export type GoTerm = {
  aspect: string;
  assigned_by: string;
  db_names: string;
  db_type: string;
  evidence_code: string;
  go_id: string;
  go_name: string;
  go_term_specificity: number;
  references: string;
};

export type BatchQueryItem = {
  geneId: string;
  mouseGeneSymbol: string;
  humanGeneIds: string | Array<string>;
  humanGeneSymbols: string | Array<string>;
  allSignificantSystems: Array<string>;
  allSignificantPhenotypes: Array<string>;
  alleles: Array<{
    allele: string;
    significantPhenotypes: Array<string>;
    significantLifeStages: Array<string>;
    significantSystems: Array<string>;
    notSignificantPhenotypes: Array<string>;
    notSignificantSystems: Array<string>;
  }>;
  goTerms: Array<GoTerm>;
};

export type SelectedAlleleData = {
  alelleSymbol: string;
  phenotypes: Array<string>;
};
