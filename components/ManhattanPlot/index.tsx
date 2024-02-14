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
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { isEqual } from 'lodash';
import styles from './styles.module.scss';
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Form from 'react-bootstrap/Form';
import DataTooltip from "./DataTooltip";
import { PhenotypeStatsResults } from "@/models/phenotype";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


type ChromosomeDataPoint = {
  chrName: string;
  markerSymbol: string;
  mgiGeneAccessionId: string;
  reportedPValue: number;
  seqRegionStart: number;
  seqRegionEnd: number;
  significant: boolean;
  // fields created by FE
  pos?: number,
};

const clone = obj => JSON.parse(JSON.stringify(obj));

const transformPValue = (value: number, significant: boolean) => {
  if (value === 0 && significant) {
    // put a high value to show they are really significant
    return 30;
  }
  return -Math.log10(value)
};
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
  const [geneFilter, setGeneFilter] = useState('');
  const ticks = [];
  let originalTicks = [];
  const validChromosomes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 'X'];

  const calculateTooltipXPos = (pos: number) => {
    const canvasWidth = chartRef.current.width;
    if (pos >= canvasWidth / 2) {
      return pos - (273 * 0.94);
    }
    return pos;
  }

  const associationMatchesFilter = (rawDataPoint) => {
    return rawDataPoint.geneSymbol?.toLowerCase() === geneFilter.toLowerCase() || rawDataPoint?.mgiGeneAccessionId === geneFilter;
  };

  const getThresholdXPos = (chr: string, datapoints: Array<ChromosomeDataPoint>): number => {
    switch (chr) {
      case '1':
        return 0;
      case 'X':
        return datapoints[datapoints.length - 1].pos;
      default:
        return datapoints[Math.floor(datapoints.length / 2)].pos;
    }
  }

  const options= {
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
              pValue: raw.pValue,
              significant: raw.significant
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
        radius: ctx => !!geneFilter && associationMatchesFilter(ctx.raw) ? 10 : 3,
        pointBackgroundColor: ctx => {
          const shouldBeHighlighted = !!geneFilter && associationMatchesFilter(ctx.raw);
          if (shouldBeHighlighted) return '#F7DC4A';
          return ctx.raw.y >= 4 ? `rgba(26, 133, 255, ${matchesAnotherGene ? '0.1' : '0.4'})` : `rgba(212, 17, 89, ${matchesAnotherGene ? '0.1' : '0.3'})`;
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
              pValue: rawData.pValue,
              significant: rawData.significant
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
    select: (response: PhenotypeStatsResults) => {
      const data = response.results;
      const genes = new Set<string>();
      const mgiAccessionIds = new Set<string>();
      const groupedByChr: Record<string, Array<ChromosomeDataPoint>> = {};
      data.forEach(point => {
        const chromosome = point.chrName;
        const isAValidChromosome = validChromosomes.includes(chromosome);
        if (chromosome&& !groupedByChr[chromosome] && isAValidChromosome) {
          groupedByChr[chromosome] = [];
        }
        if (chromosome && isAValidChromosome) {
          groupedByChr[chromosome].push(point);
          genes.add(point.markerSymbol);
          mgiAccessionIds.add(point.mgiGeneAccessionId);
        }
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
      const result = {
        datasets: Object.keys(groupedByChr).map((chr, i) =>  ({
          label: chr,
          data: groupedByChr[chr].map(({ pos, reportedPValue, markerSymbol, mgiGeneAccessionId, significant }) => ({
            x: pos,
            y: transformPValue(reportedPValue, significant),
            geneSymbol: markerSymbol,
            pValue: reportedPValue,
            mgiGeneAccessionId,
            chromosome: chr,
            significant,
          })),
          backgroundColor: chartColors[i],
          parsing: false
        }))
      };
      result.datasets.push({
        label: 'P-value threshold',
        type: "line" as const,
        data: Object.keys(groupedByChr).map(chr => ({ x: getThresholdXPos(chr, groupedByChr[chr]), y: 4 })),
        borderColor: "black",
        pointStyle: "rect",
        borderDash: [5, 5],
        radius: 0,
      } as any);
      return {
        chartData: result,
        listOfGenes: [...genes],
        listOfAccessions: [...mgiAccessionIds],
      };
    }
  });
  const matchesAnotherGene = !!geneFilter && (data.listOfGenes?.includes(geneFilter) || data.listOfAccessions?.includes(geneFilter));
  
  return (
    <div>
      <div className={styles.labelsWrapper}>
        <div>
          <i className="fa fa-circle" style={{ color: 'rgb(212, 17, 89)' }}></i>&nbsp;&nbsp;Not significant
          <i className="fa fa-circle" style={{ color: 'rgb(26, 133, 255)', marginLeft: '1rem' }}></i>&nbsp;&nbsp;Significant
        </div>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
          <label className="grey" htmlFor="geneHighlight" style={{ marginRight: "0.5rem" }}>Find gene:</label>
          <Form.Control
            id="geneHighlight"
            type="text"
            value={geneFilter}
            onChange={(e) => setGeneFilter(e.target.value)}
          />
        </div>
      </div>
      {!!data ? (
        <div className={styles.chartWrapper}>
          <Scatter ref={chartRef} options={options as any} data={data.chartData as any} />
          <div>
            Significant P-value threshold (P &lt; 0.0001)
            <hr
              style={{
                border: "none",
                borderTop: "3px dashed #000",
                height: "3px",
                width: "50px",
                display: 'inline-block',
                margin: '0 0 0 0.5rem',
                opacity: 1
              }}
            />
          </div>
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
      ): (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadingProgressBar />
        </div>
      )}

    </div>
  )
};

export default ManhattanPlot;