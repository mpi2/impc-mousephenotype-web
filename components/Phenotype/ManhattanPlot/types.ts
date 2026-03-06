export type ChromosomeDataPoint = {
  chrName: string;
  markerSymbol: string;
  mgiGeneAccessionId: string;
  reportedPValue: number | null;
  seqRegionStart: number;
  seqRegionEnd: number;
  significant: boolean;
  // fields created by FE
  pos: number;
};

export type ChartChromosome = {
  x: number;
  y: number;
  geneSymbol: string;
  pValue: number | null;
  mgiGeneAccessionId: string;
  chromosome: string;
  significant: boolean;
};

export type TooltipData = {
  chromosome: string;
  genes: Array<ChartChromosome>;
};

export type Point = { x: number; y: number; geneList: string };

export type Ticks = Array<{ value: number; label: string }>;
