
export type LateAdultData = {
  columns: Array<string>;
  rows: Array<{
    markerSymbol: string;
    mgiGeneAccessionId: string;
    significance: Array<number>;
  }>;
}
