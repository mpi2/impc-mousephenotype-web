import { GeneStatisticalResult } from "@/models/gene";

export type GraphicalAnalysisDataItem = GeneStatisticalResult & {
  pValue: number;
  arrPos: number;
  chartValue: number;
};
