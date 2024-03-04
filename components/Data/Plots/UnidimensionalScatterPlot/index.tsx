import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
  ScatterController,
  LineController,
} from "chart.js";

import "chartjs-adapter-moment";
import { FC } from "react";

import { Chart } from "react-chartjs-2";
import {
  bgColors,
  borderColors,
  pointRadius,
  shapes,
  UnidimensionalSeries,
} from "..";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  CategoryScale,
  ScatterController,
  LineController
);

interface IUnidimensionalScatterPlotProps {
  scatterSeries: Array<UnidimensionalSeries>;
  lineSeries: Array<Array<UnidimensionalSeries>>;
  zygosity: "homozygote" | "heterozygote" | "hemizygote";
  parameterName: string;
  unit: string;
}

const getScatterDataset = (series: UnidimensionalSeries, zygosity) => {
  const labelSex = series.sex[0].toUpperCase() + series.sex.slice(1);
  const labelZyg = zygosity === "homozygote" ? "HOM" : zygosity === 'hemizygote' ? 'HEM' : 'HET';
  const labelGroup = series.sampleGroup == "experimental" ? labelZyg : "WT";
  const order = labelGroup !== 'WT' ? 1 : 2;
  const label = `${labelSex} ${labelGroup}`;

  return {
    type: "scatter" as const,
    label,
    backgroundColor: bgColors[series.sampleGroup],
    data: series.data,
    borderColor: borderColors[series.sampleGroup],
    borderWidth: 1,
    pointStyle: shapes[series.sex],
    radius: pointRadius,
    yAxisID: "y",
    order,
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
        aspectRatio: 2,
        plugins: {
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: ({ dataset, parsed, raw}) =>
                `${dataset.label}: ${parsed.y} ${unit} (${raw.x.format('MMMM YYYY')})`,
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
              tooltipFormat: "DD MMM YYYY",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              text: `${parameterName} (${unit})`,
              display: true,
              align: "center",
              padding: 5,
            },
          },
          y1: {
            type: "linear",
            display: false,
            position: "right",
            max: 1.1,
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
