import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from "react-chartjs-2";
import { chartColors } from "@/utils/chart";
import annotationPlugin from "chartjs-plugin-annotation";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { isEqual } from 'lodash';
import styles from './styles.module.scss';
import { formatPValue } from "@/utils";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Form from 'react-bootstrap/Form';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

type Gene = { mgiGeneAccessionId: string, geneSymbol: string, pValue: number };
type TooltipProps = {
  tooltip: {
    opacity: number;
    top: number;
    left: number;
    chromosome: string,
    genes: Array<Gene>,
  };
  offsetX: number;
  offsetY: number;
  onClick: () => void;
  onGeneClick: (gene: Gene) => void;
};

type ChromosomeDataPoint = {
  chrName: string;
  markerSymbol: string;
  mgiGeneAccessionId: string;
  reportedPValue: number;
  seqRegionStart: number;
  seqRegionEnd: number;
  // fields created by FE
  pos?: number,
};

const clone = obj => JSON.parse(JSON.stringify(obj));

const DataTooltip = ({tooltip, offsetY, offsetX, onClick, onGeneClick}: TooltipProps) => {
  const isPValueAboveThreshold = (gene: any) => {
    return -Math.log10(gene.pValue) > 4;
  }
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
            {isPValueAboveThreshold(gene) ? (
              <a
                className="primary link"
                target="_blank"
                href={`/genes/${gene.mgiGeneAccessionId}`}
              >
                {gene.geneSymbol}
              </a>
            ) : (
              <span>{gene.geneSymbol}</span>
            )}

            <br/>
            P-value: {!!gene.pValue ? formatPValue(gene.pValue) : 0}
          </li>
        )) }
      </ul>
    </div>
  )
}

const transformPValue = (value: number) => -Math.log10(value);
const ManhattanPlot = ({ phenotypeId, onGeneClick }) => {
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
  const [geneFilter, setGeneFilter] = useState('');
  const ticks = [];
  let originalTicks = [];
  const validChromosomes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 'X'];

  const calculateTooltipXPos = (pos: number) => {
    const canvasWidth = chartRef.current.width;
    if (pos >= canvasWidth / 2) {
      return pos - (175 * 1.17);
    }
    return pos;
  }

  const associationMatchesFilter = (rawDataPoint) => {
    return rawDataPoint.geneSymbol.includes(geneFilter) || rawDataPoint.mgiGeneAccessionId === geneFilter;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
        min: 0,
        max: 45
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
      },
    },
    elements: {
      point: {
        radius: ctx => !!geneFilter && associationMatchesFilter(ctx.raw) ? 7 : 3,
        pointBackgroundColor: ctx => {
          const shouldBeHighlighted = !!geneFilter && associationMatchesFilter(ctx.raw);
          if (shouldBeHighlighted) return '#F7DC4A';
          return ctx.raw.y >= 4 ? `#FFA500` : '#00FFFF';
        },
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
    queryFn: () => fetchAPI(`/api/v1/phenotypestatsresults/${phenotypeId}/phenotype`),
    enabled: router.isReady,
    select: (response) => {
      const data = response.results;
      const groupedByChr: Record<string, Array<ChromosomeDataPoint>> = {};
      data.forEach(point => {
        const chromosome = point.chrName;
        const isAValidChromosome = validChromosomes.includes(chromosome);
        if (chromosome&& !groupedByChr[chromosome] && isAValidChromosome) {
          groupedByChr[chromosome] = [];
        }
        if (chromosome && isAValidChromosome)
          groupedByChr[chromosome].push(point);
      });
      let basePoint = 0;
      Object.keys(groupedByChr).forEach(chr => {
        groupedByChr[chr].forEach(value => value.pos = value.seqRegionStart + basePoint);
        groupedByChr[chr].sort((g1, g2) => {
          const { seqRegionStart: seqRS1 } = g1;
          const { seqRegionStart: seqRS2 } = g2;
          return seqRS1 - seqRS2;
        });
        const maxPoint = groupedByChr[chr].slice(-1)[0];
        const minPoint = groupedByChr[chr][0];
        basePoint = maxPoint.pos;
        ticks.push({ value: ((maxPoint.pos + minPoint.pos) / 2) + 1, label: chr });
      });
      originalTicks = clone(ticks);
      options.scales.x.max = basePoint;
      return {
        datasets: Object.keys(groupedByChr).map((chr, i) =>  ({
          label: chr,
          data: groupedByChr[chr].map(({ pos, reportedPValue, markerSymbol, mgiGeneAccessionId }) => ({
            x: pos,
            y: transformPValue(reportedPValue),
            geneSymbol: markerSymbol,
            pValue: reportedPValue,
            mgiGeneAccessionId,
            chromosome: chr
          })),
          backgroundColor: chartColors[i],
          parsing: false
        }))
      };

    }
  });


  return (
    <div className={styles.chartWrapper}>
      <div className={styles.labelsWrapper}>
        <div>
          <i className="fa fa-circle" style={{ color: '#00FFFF' }}></i>&nbsp;&nbsp;Not significant
          <i className="fa fa-circle" style={{ color: '#FFA500', marginLeft: '1rem' }}></i>&nbsp;&nbsp;Significant
        </div>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
          <label className="grey" htmlFor="geneHighlight" style={{ marginRight: "0.5rem" }}>Highlight gene:</label>
          <Form.Control
            id="geneHighlight"
            type="text"
            value={geneFilter}
            onChange={(e) => setGeneFilter(e.target.value)}
          />
        </div>
      </div>
      {!!data ? (
        <>
          <Scatter ref={chartRef} options={options as any} data={data as any} />
          <DataTooltip
            tooltip={clickTooltip}
            offsetX={0}
            offsetY={10}
            onClick={() =>
              // reset genes and chromosome data to show hovering tooltip
              setClickTooltip(prevState => ({ ...prevState, genes:[], chromosome: '', opacity: 0 })
            )}
            onGeneClick={onGeneClick}
          />
          <DataTooltip tooltip={hoverTooltip} offsetX={0} offsetY={10} onClick={() => {}} onGeneClick={onGeneClick} />
        </>
      ): (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadingProgressBar />
        </div>
      )}

    </div>
  )
};

export default ManhattanPlot;