import ChartSummary from "@/components/Data/ChartSummary/ChartSummary";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/api-service";
import _ from "lodash";
import { Card, Col, Row } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import errorbarsPlugin from "@/utils/chart/errorbars.plugin";
import { mutantChartColors, wildtypeChartColors } from "@/utils/chart";
import { useQueries } from "@tanstack/react-query";
import { getDownloadData } from "@/utils";
import DownloadData from "../DownloadData";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineController,
  BarController
);

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const parameterList = [
  "IMPC_ABR_002_001",
  "IMPC_ABR_004_001",
  "IMPC_ABR_006_001",
  "IMPC_ABR_008_001",
  "IMPC_ABR_010_001",
  "IMPC_ABR_012_001",
];

type ABRProps = {
  datasetSummaries: Array<any>;
  onNewSummariesFetched: (missingSummaries: Array<any>) => void;
};

const ABR = (props: ABRProps) => {
  const { datasetSummaries, onNewSummariesFetched } = props;
  const [datasets, setDatasets] = useState<Array<any>>(datasetSummaries);
  const [zygosity, setZygosity] = useState(datasetSummaries[0].zygosity);
  useEffect(() => {
    const {
      mgiGeneAccessionId,
      alleleAccessionId,
      pipelineStableId,
      zygosity,
      procedureStableId,
      phenotypingCentre,
    } = datasetSummaries[0];
    const proceduresWithData = datasetSummaries.map((d) => d.parameterStableId);
    const missingProcedures = parameterList.filter(
      (p) => !proceduresWithData.includes(p)
    );
    const requests = missingProcedures.map((parameter) =>
      fetchAPI(
        `/api/v1/genes/dataset/find_by_multiple_parameter?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameter}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`
      )
    );
    Promise.allSettled(requests)
      .then((responses) =>
        responses
          .filter((promiseRes) => promiseRes.status === "fulfilled")
          .map(
            (promiseRes) => (promiseRes as PromiseFulfilledResult<any>).value
          )
      )
      .then((responses) => {
        const proceduresData = [];
        responses.forEach((datasets) => {
          const uniques = [];
          datasets.forEach(({ id, ...ds }) => {
            if (!uniques.find((d) => _.isEqual(d, ds))) {
              uniques.push({ id, ...ds });
            }
          });
          const selectedDataset = uniques[0];
          proceduresData.push(selectedDataset);
        });
        return proceduresData;
      })
      .then((missingProcedureData) => {
        // get data from props first, then add missing data
        const allData = clone(datasetSummaries);
        missingProcedureData.forEach((d) => allData.push(d));
        allData.sort((d1, d2) =>
          d1.parameterStableId.localeCompare(d2.parameterStableId)
        );
        onNewSummariesFetched(missingProcedureData);
        setDatasets(allData);
      });
  }, [datasetSummaries]);

  const results = useQueries({
    queries: datasetSummaries.map((d) => ({
      queryKey: d.dataSetId,
      queryFn: () =>
        fetch(
          `https://impc-datasets.s3.eu-west-2.amazonaws.com/${
            process.env.NEXT_PUBLIC_DR_DATASET_VERSION || "latest"
          }/${d.datasetId}.json`
        ).then((res) => res.json()),
    })),
  });
  const loadingData = results.map((d) => d.isLoading).every(Boolean);

  const downloads = loadingData
    ? []
    : datasetSummaries.map((d, i) => getDownloadData(d, results[i].data));
  const downloadFields = downloads[0]?.fields || [];
  const downloadData = downloads.flatMap((d) => d.data);

  const getChartLabels = () => {
    return [
      "Click-evoked ABR threshold",
      null,
      "6kHz-evoked ABR Threshold",
      "12kHz-evoked ABR Threshold",
      "18kHz-evoked ABR Threshold",
      "24kHz-evoked ABR Threshold",
      "30kHz-evoked ABR Threshold",
    ];
  };
  const getStatsData = (
    sex: "fem" | "male",
    zygLabel: "Het" | "Hom" | "WT"
  ) => {
    const data = clone(datasets);
    data.sort((d1, d2) =>
      d1.parameterStableId.localeCompare(d2.parameterStableId)
    );
    const sexKey = sex === "fem" ? "female" : "male";
    const zygKey = zygLabel === "WT" ? "Control" : "Mutant";
    const propName = sexKey + zygKey + "Mean";
    const propNameSD = sexKey + zygKey + "Sd";
    const result = data.map(({ summaryStatistics, parameterName }) => {
      return {
        y: summaryStatistics[propName],
        yMin: summaryStatistics[propName] - summaryStatistics[propNameSD],
        yMax: summaryStatistics[propName] + summaryStatistics[propNameSD],
        x: parameterName,
      };
    });
    // add the empty column to separate click from 6kHz
    // be aware of difference in capitalisation of threshold word
    if (result[0].x !== "Click-evoked ABR threshold") {
      result.splice(0, 0, { y: null, x: "Click-evoked ABR threshold" });
      result.splice(1, 0, { y: null, x: null });
    } else {
      result.splice(1, 0, { y: null, x: null });
    }
    return result;
  };
  const processData = () => {
    const zygLabel = zygosity === "heterozygote" ? "Het" : "Hom";
    const mutantFemData = getStatsData("fem", zygLabel);
    const wtFemData = getStatsData("fem", "WT");
    const mutantMaleData = getStatsData("male", zygLabel);
    const wtMaleData = getStatsData("male", "WT");
    return [
      {
        type: "line" as const,
        label: `Male ${zygLabel}.`,
        data: mutantMaleData,
        borderColor: mutantChartColors.fullOpacity,
        backgroundColor: mutantChartColors.halfOpacity,
        pointStyle: "circle",
      },
      {
        type: "line" as const,
        label: `Male WT`,
        data: wtMaleData,
        borderColor: wildtypeChartColors.fullOpacity,
        backgroundColor: wildtypeChartColors.halfOpacity,
        pointStyle: "rectRot",
      },
      {
        type: "line" as const,
        label: `Female ${zygLabel}.`,
        data: mutantFemData,
        borderColor: mutantChartColors.fullOpacity,
        backgroundColor: mutantChartColors.halfOpacity,
        pointStyle: "rect",
      },
      {
        type: "line" as const,
        label: `Female WT`,
        data: wtFemData,
        borderColor: wildtypeChartColors.fullOpacity,
        backgroundColor: wildtypeChartColors.halfOpacity,
        pointStyle: "triangle",
      },
    ];
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    scales: {
      y: {
        min: 0,
        max: 120,
        title: {
          display: true,
          text: "dB SPL",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true },
      },
      tooltip: {
        usePointStyle: true,
        title: { padding: { top: 10 } },
        callbacks: {
          label: (ctx) => {
            const minValue = ctx.raw.yMin.toFixed(2);
            const maxValue = ctx.raw.yMax.toFixed(2);
            return `${ctx.dataset.label}: ${ctx.formattedValue} (SD: ${minValue} - ${maxValue})`;
          },
        },
      },
    },
  };

  const chartData = {
    labels: getChartLabels(),
    datasets: processData(),
  };

  const chartPlugins = [errorbarsPlugin];

  return (
    <>
      <ChartSummary datasetSummary={datasetSummaries[0]} />
      <Card>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>
            Evoked ABR Threshold (6, 12, 18, 18, 24, 30 kHz)
          </h2>
          <a
            className="primary link"
            href="//www.mousephenotype.org/impress/ProcedureInfo?action=list&procID=670"
          >
            Auditory Brain Stem Response
          </a>
        </div>
        <div style={{ position: "relative", height: "400px" }}>
          <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
            plugins={chartPlugins}
          />
        </div>
      </Card>
      <Row>
        <Col>
          {" "}
          <Card>
            <h2>Experimental data download</h2>
            {!loadingData && (
              <DownloadData
                fileName={`ABR_${datasetSummaries[0].mgiGeneAccessionId}`}
                fields={downloadFields}
                data={downloadData}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ABR;
