import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from "react-chartjs-2";
import { chartColors } from "../../utils/chart";
import annotationPlugin from "chartjs-plugin-annotation";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";
import mockData from "../../mocks/data/phenotypes/MP:0012361/gwas.json";
import { useRouter } from "next/router";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

const transformPValue = (value: number) => -Math.log10(value);
const ManhattanPlot = ({ phenotypeId }) => {
  const router = useRouter();
  const ticks = [];
  let originalTicks = [];

  const options = {
    scales: {
      x: {
        display: true, max: 0,
        ticks: { autoSkip: false },
        grid: { display: false },
        afterBuildTicks: axis => {
          if (ticks.length) {
            axis.ticks = ticks;
          }
        },
        afterTickToLabelConversion: axis => {
          if (ticks.length) {
            axis.ticks.forEach(tick => {
              tick.label = originalTicks.find(t => t.value === tick.value).label;
            });
          }
        }
      },
    },
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 4,
            yMax: 4,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          }
        }
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: items => 'Chromosome: ' + items[0].raw.chromosome,
          label: item => 'Gene symbol: ' + item.raw.geneSymbol,
          footer: items => 'P-value: ' + items[0].raw.pValue.toExponential(3)
        }
      }
    },
    elements: {
      point: {
        pointBackgroundColor: ctx => ctx.raw.y >= 4 ? '#FFA500' : '#00FFFF'
      }
    },
    onClick: (e, elements) =>  {
      if (elements.length) {
        const gene = elements[0].element?.$context?.raw;
        console.log(gene);
        router.push(`/genes/${gene.mgiGeneAccessionId}`);
      }
    }
  };

  const { data } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'gwas'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/gwas`),
    enabled: router.isReady,
    initialData: mockData,
    select: data => {
      console.log(data);
      const groupedByChr = {};
      data.forEach(point => {
        if (point.chrName && !groupedByChr[point.chrName]) {
          groupedByChr[point.chrName] = [];
        }
        if (point.chrName)
          groupedByChr[point.chrName].push({
            ...point,
            seqRegionStart: parseInt(point.seqRegionStart, 10),
          });
      });
      let basePoint = 0;
      Object.keys(groupedByChr).forEach(chr => {
        groupedByChr[chr].forEach(value => value.pos = value.seqRegionStart + basePoint);
        groupedByChr[chr].sort((g1, g2) => {
          const { seqRegionStart: seqRegionStart1 } = g1;
          const { seqRegionStart: seqRegionStart2 } = g2;
          return seqRegionStart1 - seqRegionStart2;
        });
        const maxPoint = groupedByChr[chr].slice(-1)[0];
        const minPoint = groupedByChr[chr][0];
        basePoint = maxPoint.pos;
        ticks.push({ value: ((maxPoint.pos + minPoint.pos) / 2) + 1, label: chr });
      });
      originalTicks = JSON.parse(JSON.stringify(ticks));
      options.scales.x.max = basePoint;
      return {
        datasets: Object.keys(groupedByChr).map((chr, i) =>  ({
          label: chr,
          data: groupedByChr[chr].map(({ pos, pValue, geneSymbol, mgiGeneAccessionId }) => ({
            x: pos,
            y: transformPValue(pValue),
            geneSymbol,
            pValue,
            mgiGeneAccessionId,
            chromosome: chr
          })),
          backgroundColor: chartColors[i],
        }))
      };

    }
  });

  if (!data) {
    return null;
  }

  return (
    <Scatter options={options as any} data={data} />
  )
};

export default ManhattanPlot;