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
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { isEqual } from 'lodash';
import mockData from "../../mocks/data/phenotypes/MP:0012361/gwas.json";
import styles from './styles.module.scss';
import { formatPValue } from "../../utils";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

type TooltipProps = {
  tooltip: {
    opacity: number;
    top: number;
    left: number;
    chromosome: string,
    genes: Array<{ mgiGeneAccessionId: string, geneSymbol: string, pValue: number }>,
  };
  offsetX: number;
  offsetY: number;
  onClick: () => void;
};

const DataTooltip = ({tooltip, offsetY, offsetX, onClick}: TooltipProps) => {
  const getChromosome = () => {
    if (tooltip.chromosome === '20') {
      return 'X';
    } else if (tooltip.chromosome === '21') {
      return 'Y';
    }
    return tooltip.chromosome;
  }
  return (
    <div
      className={`${styles.tooltip} ${tooltip.opacity === 0 ? styles.noVisible: styles.visible }`}
      style={{ top: tooltip.top + offsetX, left: tooltip.left + offsetY, opacity: tooltip.opacity }}
    >
      <button className={styles.closeBtn} onClick={onClick}>×</button>
      <span><strong>Chr: </strong>{ getChromosome() }</span>
      <ul>
        { tooltip.genes.map(gene => (
          <li key={gene.mgiGeneAccessionId}>
            Gene:&nbsp;
            <a className="primary link" target="_blank" href={`/genes/${gene.mgiGeneAccessionId}`}>
              {gene.geneSymbol}
            </a>
            <br/>
            P-value: {!!gene.pValue ? formatPValue(gene.pValue) : 0}
          </li>
        )) }
      </ul>
    </div>
  )
}

const transformPValue = (value: number) => -Math.log10(value);
const ManhattanPlot = ({ phenotypeId }) => {
  const router = useRouter();
  const chartRef = useRef(null);
  const [hoverTooltip, setHoverTooltip] = useState({
    opacity: 0,
    top: 0,
    left: 0,
    chromosome: '',
    genes: [],
  });
  const [clickTooltip, setClickTooltip] = useState({
    opacity: 0,
    top: 0,
    left: 0,
    chromosome: '',
    genes: [],
  });
  const ticks = [];
  let originalTicks = [];

  const calculateTooltipXPos = (pos: number) => {
    const canvasWidth = chartRef.current.width;
    if (pos >= canvasWidth / 2) {
      return pos - (175 * 1.03);
    }
    return pos;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        max: 0,
        ticks: { autoSkip: false },
        grid: { display: false },
        title: { display: true, text: 'chromosome' },
        afterBuildTicks: axis => {
          if (ticks.length) {
            axis.ticks = ticks;
          }
        },
        afterTickToLabelConversion: axis => {
          if (ticks.length) {
            axis.ticks.forEach(tick => {
              let label = originalTicks.find(t => t.value === tick.value).label;
              if (label === '20') {
                label = 'X';
              } else if (label === '21') {
                label = 'Y';
              }
              tick.label = label;
            });
          }
        }
      },
      y: {
        title: { display: true, text: '-log₁₀(P-value)' },
      }
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
        enabled: false,
        mode: 'point',
        external: context => {
          const tooltipModel = context.tooltip;
          if (!chartRef || !chartRef.current) return;
          if (tooltipModel.opacity === 0) {
            if (hoverTooltip.opacity !== 0) {
              setHoverTooltip(prev => ({ ...prev, opacity: 0 }));
            }
            return;
          }
          const newTooltipData = {
            opacity: 1,
            left: calculateTooltipXPos(tooltipModel.caretX),
            top: tooltipModel.caretY,
            chromosome: tooltipModel.dataPoints[0].dataset.label,
            genes: tooltipModel.dataPoints.map(({ raw }) => ({
              geneSymbol: raw.geneSymbol,
              mgiGeneAccessionId: raw.mgiGeneAccessionId,
              pValue: raw.pValue
            })),
          };
          if (isEqual(newTooltipData.genes, clickTooltip.genes)) {
            // if tooltip opened by click has the same data as tooltip opened by hover
            // that would mean the user just clicked on a point, so we should
            // render only one tooltip
            setHoverTooltip(prev => ({ ...prev, opacity: 0 }));
            return;
          }
          if (!isEqual(hoverTooltip, newTooltipData)) {
            setHoverTooltip(newTooltipData);
          }
        },
      }
    },
    elements: {
      point: {
        pointBackgroundColor: ctx => ctx.raw.y >= 4 ? '#FFA500' : '#00FFFF'
      }
    },
    onHover: (e, elements) => !!elements.length ? e.native.target.style.cursor = 'pointer' : e.native.target.style.cursor = 'auto',
    onClick: (e, elements) =>  {
      if (elements.length) {
        const newTooltipData = {
          opacity: 1,
          // we assume if onClick is triggered, the mouse is already hovering a point and
          // the hovering tooltip have appeared, we use the coordinates to minimize the change
          left: hoverTooltip.left,
          top: hoverTooltip.top,
          chromosome: elements[0].element['$context'].raw.chromosome,
          genes: elements.map(point => point.element['$context'].raw).map(rawData => {
            return {
              geneSymbol: rawData.geneSymbol,
              mgiGeneAccessionId: rawData.mgiGeneAccessionId,
              pValue: rawData.pValue
            };
          })
        };
        if (!isEqual(clickTooltip, newTooltipData)) {
          setClickTooltip(newTooltipData);
        }
      }
    },
  };

  const { data } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'gwas'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/gwas`),
    enabled: router.isReady,
    initialData: mockData,
    select: data => {
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
    <div className={styles.chartWrapper}>
      <Scatter ref={chartRef} options={options as any} data={data} />
      <DataTooltip
        tooltip={clickTooltip}
        offsetX={0}
        offsetY={10}
        onClick={() =>
          // reset genes and chromosome data to show hovering tooltip
          setClickTooltip(prevState => ({ ...prevState, genes:[], chromosome: '', opacity: 0 })
        )}
      />
      <DataTooltip tooltip={hoverTooltip} offsetX={0} offsetY={10} onClick={() => {}} />
    </div>
  )
};

export default ManhattanPlot;