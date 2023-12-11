import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props  {
  title: string;
  data: any;
  xAxisTitle?: string;
  yAxisTitle?: string
}
const ScatterChart = ({ title, data, xAxisTitle, yAxisTitle }: Props) => {
  return (
    <Scatter
      data={{
        datasets: [{
          label: title,
          data: data,
          backgroundColor: 'rgba(239, 123, 11,0.7)',
        }]
      }}
      options={{
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true, min: 0, title: { display: !!xAxisTitle, text: xAxisTitle }},
          y: { title: { display: !!yAxisTitle, text: yAxisTitle }},
        },
        plugins: {
          tooltip: {
            mode: 'index',
            callbacks: {
              title : ctx => (ctx[0]['raw'] as any).markerSymbol,
              label: ctx => `Other phenotype calls: ${ctx.label}`,
              footer: ctx => `Cardiovascular System phenotype calls: ${ctx[0].formattedValue}`,
            }
          }
        }
      }}
    />
  )
};

export default ScatterChart;