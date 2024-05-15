import { Dataset } from "@/models";
import { useMemo, useState } from "react";
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
import { ViolinController, Violin } from "@sgratzl/chartjs-chart-boxplot";
import { Card } from "@/components";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import ChartSummary from "@/components/Data/ChartSummary/ChartSummary";
import AlleleSymbol from "@/components/AlleleSymbol";
import { useMultipleS3DatasetsQuery } from "@/hooks";
import quartileLinesPlugin from "@/utils/chart/violin-quartile-lines.plugin";


ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ViolinController,
  Violin,
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
          type: "violin" as const,
          label: result.label,
          data: [
            parseData(result.series, 'male', 'experimental'),
            parseData(result.series, 'male', 'control'),
            parseData(result.series, 'female', 'experimental'),
            parseData(result.series, 'female', 'control'),
          ],
          itemRadius: 0,
          padding: 100,
          outlierRadius: 5,
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
      legend: { display: true },
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
        <div>
          {results.length > 2 ? (
            <>
              <div style={{position: "relative", height: "400px"}}>
                <Chart
                  type="violin"
                  data={chartData}
                  options={chartOptions}
                  plugins={[quartileLinesPlugin]}
                />
              </div>
              <div>
                <div>
                  <div style={{display: "inline-block"}}>
                    Top
                    <hr
                      style={{
                        border: "none",
                        borderTop: "3px dotted #000",
                        height: "3px",
                        width: "30px",
                        display: 'inline-block',
                        margin: '0 0 0 0.5rem',
                        opacity: 1
                      }}
                    />
                    &nbsp;line: 75th percentile
                  </div>
                  <br/>
                  <div style={{display: "inline-block"}}>
                    Middle
                    <hr
                      style={{
                        border: "none",
                        borderTop: "3px dashed #000",
                        height: "3px",
                        width: "30px",
                        display: 'inline-block',
                        margin: '0 0 0 0.5rem',
                        opacity: 1
                      }}
                    />
                    &nbsp;line: 50th percentile
                  </div>
                  <br/>
                  <div style={{display: "inline-block"}}>
                    Bottom
                    <hr
                      style={{
                        border: "none",
                        borderTop: "3px dotted #000",
                        height: "3px",
                        width: "30px",
                        display: 'inline-block',
                        margin: '0 0 0 0.5rem',
                        opacity: 1
                      }}
                    />
                    &nbsp;line: 25th percentile
                  </div>
                  <br/>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', }}>
                    <div style={{
                      display: 'inline-block',
                      border: '1px solid #000',
                      width: '12px',
                      height: '12px',
                      transform: 'rotateZ(45deg)'
                    }} />
                    : mean value
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <LoadingProgressBar/>
            </div>
          )}
        </div>
      </Card>
    </>
  );

};

export default PPI;