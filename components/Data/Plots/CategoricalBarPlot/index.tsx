import { Chart } from "react-chartjs-2";
import { CategoricalSeries, } from "..";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
  BarElement,
} from "chart.js";
import { getZygosityLabel } from "@/components/Data/Utils";
import { capitalize } from "lodash";

const colorArray = ["#D41159", "#0978a1", "#117733", "#44AA99", "#88CCEE", "#DDCC77", "#CC6677", "#AA4499"];

ChartJS.register(
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  CategoryScale
);

const getCategoricalBarDataset = (
  series: CategoricalSeries,
  zygosity,
  categories
) => {
  return {
    backgroundColor: colorArray[categories.indexOf(series.category)],
    label: series.category,
    stack: "0",
    data: [series.value],
  };
};

const CategoricalBarPlot = ({ series, zygosity }) => {
  const datasets = {};
  const categories = series.map((s) => s.category);
  series.forEach((s) => {
    if (!datasets[s.category]) {
      datasets[s.category] = getCategoricalBarDataset(s, zygosity, categories);
    } else {
      datasets[s.category].data.push(s.value);
    }
  });

  return (
    <Chart
      type="bar"
      data={{
        datasets: Object.values(datasets),
        labels: series
          .map((s) => {
            const labelSex = capitalize(s.sex);
            const labelGroup = getZygosityLabel(zygosity, s.sampleGroup);
            return `${labelSex} ${labelGroup}`;
          })
          .filter((value, index, self) => self.indexOf(value) === index),
      }}
      options={{
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
            },
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            stacked: true,
            position: "left",
            max: 100,
            min: 0,
            title: { text: "Percent occurrence", display: true },
          },
          x: { stacked: true, display: true, position: "bottom" },
        },
      }}
    />
  );
};

export default CategoricalBarPlot;
