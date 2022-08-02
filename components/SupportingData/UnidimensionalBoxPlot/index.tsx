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
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  BoxPlotController,
  BoxAndWiskers,
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

const getBoxPlotDataset = (series, zygosity) => {
  const boxPlotSeries = [...series].sort((a,b) => a.sex > b.sex ? 1 : -1);
  const labels = boxPlotSeries.map(({ sex, sampleGroup }) => {
    const labelSex = sex[0].toUpperCase() + sex.slice(1);
    const labelZyg = zygosity === "homozygote" ? "HOM" : "HET";
    const labelGroup = sampleGroup == "experimental" ? labelZyg : "WT";
    return `${labelSex} ${labelGroup}`;
  });

  return {
    labels,
    datasets: [
      {
        type: "boxplot" as const,
        backgroundColor: (d) => bgColors[boxPlotSeries[d.index]?.sampleGroup],
        data: boxPlotSeries.map((s) => s.data.map((i) => +i.dataPoint)),
        borderColor: (d) => boderColors[boxPlotSeries[d.index]?.sampleGroup],
        itemStyle: (d) => shapes[boxPlotSeries[d.index]?.sex],
        borderWidth: 2,
        itemRadius: 0,
        padding: 100,
        outlierRadius: pointRadius,
      },
    ],
  };
};

const UnidimensionalBoxPlot = ({ series, zygosity }) => {
  //   const values: number[] =
  //     series && series.datasets.length > 0
  //       ? series?.datasets[0]?.data.flatMap((d) => d)
  //       : [];
  //   const max = values.length > 0 ? Math.max(...values) : 0;
  //   const min = values.length > 0 ? Math.min(...values) : 0;

  return (
    <Chart
      type="boxplot"
      data={getBoxPlotDataset(series, zygosity)}
      options={{
        maintainAspectRatio: false,
        scales: {
          y: {
            type: "linear",
            // max: max,
            // min: min,
            beginAtZero: false,
            ticks: {
              align: "center",
              crossAlign: "center",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "bottom",
            labels: {
              usePointStyle: false,
              padding: 0,
            },
          },
        },
      }}
    />
  );
};

export default UnidimensionalBoxPlot;
