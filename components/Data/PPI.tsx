import { Dataset } from "@/models";
import { useEffect, useMemo } from "react";
import { useRelatedParametersQuery } from "@/hooks/related-parameters.query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Chart } from "react-chartjs-2";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Context } from "chartjs-plugin-datalabels";
import { Card } from "@/components";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import ChartSummary from "@/components/Data/ChartSummary/ChartSummary";
import AlleleSymbol from "@/components/AlleleSymbol";
import { useMultipleS3DatasetsQuery } from "@/hooks";
import ChartDataLabels from "@/shared/chart-js-plugins/datalabels";


ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  BoxPlotController,
  BoxAndWiskers,
);


const parameterList = [
  "IMPC_ACS_033_001", // % PP1
  "IMPC_ACS_034_001", // % PP2
  "IMPC_ACS_035_001", // % PP3
  "IMPC_ACS_036_001", // % PP4
];

const labels = {
  "IMPC_ACS_033_001": "% PP1",
  "IMPC_ACS_034_001": "% PP2",
  "IMPC_ACS_035_001": "% PP3",
  "IMPC_ACS_036_001": "% PP4"
};

type PPIProps = {
  datasetSummaries: Array<Dataset>;
  onNewSummariesFetched: (missingSummaries: Array<any>) => void;
};

const PPI = (props: PPIProps) => {
  const { datasetSummaries, onNewSummariesFetched } = props;

  const datasets = useRelatedParametersQuery(
    datasetSummaries,
    parameterList,
    onNewSummariesFetched
  );

  const results = useMultipleS3DatasetsQuery('PPI', datasets);

  const parseData = (series: Array<any>, sex: string, sampleGroup: string) => {
    const data = series?.find(serie => serie.sampleGroup === sampleGroup && serie.specimenSex === sex);
    return data?.observations.map(d => +d.dataPoint);
  }

  const chartDatasets = useMemo(() => {
    return parameterList
      .map(param => datasets.find(d => d.parameterStableId === param))
      .filter(Boolean)
      .map(dataset => {
        const matchingRes = results.find(r => r.datasetId === dataset.datasetId);
        return {
          ...matchingRes,
          label: labels[dataset.parameterStableId]
        }
      })
      .filter(Boolean)
      .map(result => {
        return {
          type: "boxplot" as const,
          label: result.label,
          data: [
            parseData(result.series, 'male', 'experimental'),
            parseData(result.series, 'male', 'control'),
            parseData(result.series, 'female', 'experimental'),
            parseData(result.series, 'female', 'control'),
          ],
          borderWidth: 2,
          itemRadius: 0,
          padding: 100,
          outlierRadius: 5,
          datalabels: {
            labels: {
              value: {
                display: false,
              },
              name: {
                align: "bottom" as const,
                anchor: "start" as const,
                offset: 8,
                formatter: (_, ctx: Context) => ctx.dataset.label,
              }
            }
          }
        }
      });
  }, [datasets, results]);

  const chartLabels = useMemo(() => {
    const zygosity = datasets?.[0]?.zygosity;
    const zygLabel = zygosity === "heterozygote" ? "Het" : "Hom";
    return [
      `Male ${zygLabel}`,
      `Male WT`,
      `Female ${zygLabel}`,
      `Female WT`,
    ]
  }, [datasets]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },

  };

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets,
  };

  return (
    <>
      <ChartSummary datasetSummary={datasets[0]} showParameterName={false}>
        The mutants are for the <AlleleSymbol symbol={datasets[0].alleleSymbol} withLabel={false} />
        <ul>
          {datasets.map(d => (
            <li>
              <strong>{d.parameterName}</strong>:&nbsp;
              {d["summaryStatistics"]["femaleMutantCount"]} female, {d["summaryStatistics"]["maleMutantCount"]}
              &nbsp;male mutants compared to&nbsp;
              {d["summaryStatistics"]["femaleControlCount"]} female,&nbsp;
              {d["summaryStatistics"]["maleControlCount"]} male
              controls.
            </li>
          ))}
        </ul>
      </ChartSummary>
      <Card>
        <div style={{position: "relative", height: "400px"}}>
          {datasets.length >= 4 ? (
            <Chart
              type="boxplot"
              data={chartData}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          ) : (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <LoadingProgressBar/>
            </div>
          )}
        </div>
      </Card>
    </>
  );

};

export default PPI;