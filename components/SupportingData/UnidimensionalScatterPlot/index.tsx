import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
} from "chart.js";

import "chartjs-adapter-moment";
import { FC } from "react";

import { Chart } from "react-chartjs-2";
import { UnidimensionalSeries } from "..";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  CategoryScale
);

interface IUnidimensionalScatterPlotProps {
  scatterSeries: Array<UnidimensionalSeries>;
  lineSeries: Array<UnidimensionalSeries>;
  zygosity: "homozygote" | "heterozygote" | "hemizygote";
  parameterName: string;
  unit: string;
}

const bgColors = {
  control: "rgba(239, 123, 11, 0.2)",
  experimental: "rgba(9, 120, 161, 0.7)",
};
const boderColors = {
  control: "rgba(239, 123, 11, 0.5)",
  experimental: "rgba(9, 120, 161, 0.7)",
};
const shapes = { male: "triangle", female: "circle" };
const pointRadius = 5;

const getScatterDataset = (series: UnidimensionalSeries, zygosity) => {
  const labelSex = series.sex[0].toUpperCase() + series.sex.slice(1);
  const labelZyg = zygosity === "homozygote" ? "HOM" : "HET";
  const labelGroup = series.sampleGroup == "experimental" ? labelZyg : "WT";
  const label = `${labelSex} ${labelGroup}`;

  return {
    type: "scatter" as const,
    label,
    backgroundColor: bgColors[series.sampleGroup],
    data: series.data,
    borderColor: boderColors[series.sampleGroup],
    borderWidth: 1,
    pointStyle: shapes[series.sex],
    radius: pointRadius,
    yAxisID: "y",
  };
};

const getSWindowDataset = (data) => {
  return {
    type: "line" as const,
    label: "Soft window statistical weight",
    backgroundColor: "black",
    data: data,
    borderColor: "black",
    borderWidth: 3,
    pointStyle: "rect",
    radius: 0,
    yAxisID: "y1",
    borderDash: [5, 5],
  };
};

const UnidimensionalScatterPlot: FC<IUnidimensionalScatterPlotProps> = ({
  scatterSeries,
  lineSeries,
  zygosity,
  parameterName,
  unit,
}) => {
  return (
    <Chart
      type="scatter"
      data={{
        datasets: [
          ...scatterSeries.map((s) => getScatterDataset(s, zygosity)),
          ...lineSeries.map(getSWindowDataset),
        ],
      }}
      options={{
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: ({ dataset, parsed }) =>
                `${dataset.label}: ${parsed.y} ${unit} (${parsed.x})`,
            },
          },
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            display: true,
            offset: true,
            time: {
              unit: "month",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              text: `${parameterName} (${unit})`,
            },
          },
          y1: {
            type: "linear",
            display: false,
            position: "right",

            grid: {
              drawOnChartArea: false,
            },
          },
        },
      }}
    />
  );
};

export default UnidimensionalScatterPlot;
