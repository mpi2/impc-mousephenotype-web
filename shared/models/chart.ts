import { Dataset } from "@/models/dataset";
import { ReactNode } from "react";

export type GeneralChartProps = {
  datasetSummary: Dataset;
  isVisible: boolean;
  children?: ReactNode
};