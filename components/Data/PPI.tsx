import { Dataset } from "@/models";
import { useMemo } from "react";
import { useRelatedParametersQuery } from "@/hooks/related-parameters.query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Chart } from "react-chartjs-2";
import { Card } from "@/components";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import ChartSummary from "@/components/Data/ChartSummary/ChartSummary";
import AlleleSymbol from "@/components/AlleleSymbol";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
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

  const chartDatasets = useMemo(() => {
    return parameterList
      .map(param => datasets.find(d => d.parameterStableId === param))
      .filter(Boolean)
      .map(dataset => {
        return {
          label: labels[dataset.parameterStableId],
          data: [
            dataset.summaryStatistics.maleMutantMean,
            dataset.summaryStatistics.maleControlMean,
            dataset.summaryStatistics.femaleMutantMean,
            dataset.summaryStatistics.femaleControlMean
          ]
        }
      });
  }, [datasets]);

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
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true },
      },
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
              type="bar"
              data={chartData}
              options={chartOptions}
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