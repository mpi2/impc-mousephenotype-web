import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
} from "chart.js";

import "chartjs-adapter-moment";

import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  CategoryScale
);

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

const getScatterDataset = ({
  sex,
  sampleGroup,
  zygosity,
  data,
}: {
  sex: string;
  sampleGroup: string;
  zygosity: string;
  data: any[];
}) => {
  const labelSex = sex[0].toUpperCase() + sex.slice(1);
  const labelZyg = zygosity === "homozygote" ? "HOM" : "HET";
  const labelGroup = sampleGroup == "experimental" ? labelZyg : "WT";
  const label = `${labelSex} ${labelGroup}`;

  return {
    type: "scatter" as const,
    label,
    backgroundColor: bgColors[sampleGroup],
    data,
    borderColor: boderColors[sampleGroup],
    borderWidth: 1,
    pointStyle: shapes[sex],
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

const UnidimensionalScatterPlot = ({ scatterSeries, lineSeries, unit }) => {
  return (
    <Chart
      type="scatter"
      data={{datasets: [...scatterSeries.map(getScatterDataset),  ...lineSeries.map(getSWindowDataset)]}}
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
          },
          y1: {
            type: "linear",
            display: false, 
            position: "right",

            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
      }}
    />
  );
};

export default UnidimensionalScatterPlot;
