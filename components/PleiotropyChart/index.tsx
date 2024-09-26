import { PleiotropyData } from "@/models";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import { LoadingProgressBar } from "@/components";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  title: string;
  data: Array<PleiotropyData>;
  isLoading: boolean;
  phenotypeName: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}
const PleiotropyChart = ({
  title,
  data,
  xAxisTitle,
  yAxisTitle,
  phenotypeName,
}: Props) => {
  const processedData = useMemo(() => {
    return data?.map((d) => ({
      markerSymbol: d.marker_symbol,
      x: d.otherPhenotypeCount,
      y: d.phenotypeCount,
    }));
  }, [data]);

  if (!data) {
    return (
      <div
        className="mt-4"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <LoadingProgressBar />
      </div>
    );
  }
  return (
    <Scatter
      data={{
        datasets: [
          {
            label: title,
            data: processedData,
            backgroundColor: "rgba(239, 123, 11,0.7)",
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            min: 0,
            title: { display: !!xAxisTitle, text: xAxisTitle },
          },
          y: { title: { display: !!yAxisTitle, text: yAxisTitle } },
        },
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              title: (ctx) => (ctx[0]["raw"] as any).markerSymbol,
              label: (ctx) => [
                `Other phenotype calls: ${(ctx.raw as any).x}`,
                `${phenotypeName} phenotype calls: ${(ctx.raw as any).y}`,
              ],
            },
          },
          legend: {
            display: false,
          },
        },
        elements: {
          line: {
            tension: 0.1,
          },
        },
      }}
    />
  );
};

export default PleiotropyChart;
