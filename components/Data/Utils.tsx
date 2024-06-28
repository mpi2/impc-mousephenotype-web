import { Dataset } from "@/models";
import {
  BodyWeightChart,
  Categorical,
  EmbryoViability,
  Histopathology,
  TimeSeries,
  Unidimensional,
  Viability,
  GrossPathology,
} from "@/components/Data";
import { ReactNode } from "react";


export const getZygosityLabel = (zygosity: string, sampleGroup: string) => {
  const labelZyg = zygosity === "hemizygote" ? 'HEM' : zygosity === "homozygote" ? "HOM" : "HET";
  return sampleGroup == "control" ? "WT" : labelZyg;
}
export const getChartType = (
  datasetSummary: Dataset,
  isVisible: boolean = true,
  extraChildren: ReactNode = <></>,
) => {
  let chartType = datasetSummary?.dataType;
  if (chartType == "line" || chartType == "embryo") {
    chartType =
      datasetSummary.procedureGroup == "IMPC_VIA"
        ? "viability"
        : datasetSummary.procedureGroup == "IMPC_FER"
          ? "fertility"
          : ["IMPC_EVL", "IMPC_EVM", "IMPC_EVP", "IMPC_EVO"].includes(
            datasetSummary.procedureGroup
          )
            ? "embryo_viability"
            : chartType;
  }

  if (
    chartType === "time_series" &&
    datasetSummary.procedureGroup === "IMPC_BWT"
  ) {
    chartType = "bodyweight";
  }
  switch (chartType) {
    case "unidimensional":
      return (
        <Unidimensional datasetSummary={datasetSummary} isVisible={isVisible}>
          {extraChildren}
        </Unidimensional>
      );
    case "categorical":
      return (
        <Categorical datasetSummary={datasetSummary} isVisible={isVisible}>
          {extraChildren}
        </Categorical>
      );

    case "time_series":
      return (
        <TimeSeries datasetSummary={datasetSummary} isVisible={isVisible}>
          {extraChildren}
        </TimeSeries>
      );
    case "viability":
      return <Viability datasetSummary={datasetSummary} isVisible={isVisible} />;
    case "embryo_viability":
      return <EmbryoViability datasetSummary={datasetSummary} isVisible={isVisible} />;
    case "embryo":
      return <Categorical datasetSummary={datasetSummary} isVisible={isVisible} />;
    case "histopathology":
      return <Histopathology datasetSummary={datasetSummary} />;
    case "bodyweight":
      return <BodyWeightChart datasetSummary={datasetSummary} />;
    case "adult-gross-path":
      return <GrossPathology datasetSummary={datasetSummary} />;
    default:
      return null;
  }
};