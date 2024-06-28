import { Dataset } from "@/models/dataset";
import { ReactNode } from "react";

export type GeneralChartProps = {
  datasetSummary: Dataset;
  isVisible: boolean;
  children?: ReactNode
};

export type ChartSeries<T> = {
  data: Array<T>;
  sampleGroup: "control" | "experimental";
  specimenSex: "male" | "female";
};