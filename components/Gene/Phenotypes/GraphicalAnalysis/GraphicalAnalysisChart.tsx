import { GeneStatisticalResult } from "@/models/gene";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
import { allBodySystems, formatBodySystems } from "@/utils";
import classNames from "classnames";
import styles from "./styles.module.scss";
import BodySystemIcon from "@/components/BodySystemIcon";
import { ZoomButtons } from "@/components";
import { Chart as ChartEl } from "react-chartjs-2";
import { Cat, cats } from './shared';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];
const systemColorMap: Record<string, string> = {};
const defaultColor = "rgba(0,0,0,0.1)";
const transparent = "rgba(255, 255, 255, 0)";
allBodySystems.forEach((system, index) => {
  systemColorMap[system] = colorArray[index];
});

const getSignificants = (data: Array<GeneStatisticalResult>) => {
  return data.filter(item => {
    const pValueThreshold = item.projectName === 'PWG' ? 3 : 4;
    return -Math.log10(Number(item.pValue)) >= pValueThreshold;
  });
};

const processData = (data: any, { type }: Cat, significantOnly: boolean) => {
  const { BODY_SYSTEMS, PROCEDURES } = cats;
  const significants = getSignificants(data);
  switch (type) {
    case BODY_SYSTEMS:
      if (significantOnly) {
        const bodySystems = significants.map((x) => x.topLevelPhenotypes[0]);
        const flattend = [].concat.apply([], bodySystems);
        const filtered = data.filter((x) => {
          return x.topLevelPhenotypes.some((y) => flattend.includes(y));
        });
        return _.sortBy(filtered, ["topLevelPhenotypes", "parameterName"]);
      }
      return _.sortBy(data, ["topLevelPhenotypes", "parameterName"]);
    case PROCEDURES:
      if (significantOnly) {
        const procedures = significants.map((x) => x.procedureName);
        const filtered = data.filter((x) => {
          return procedures.includes(x.procedureName);
        });
        return _.sortBy(filtered, ["procedureName", "parameterName"]);
      }
      return _.sortBy(data, ["procedureName", "parameterName"]);
    default:
      return _.sortBy(significantOnly ? significants : data, "pValue", "desc");
  }
};

const transformPValue = (value: number, significant: boolean) => {
  if (value === 0 && significant) {
    // put a high value to show they are really significant
    return 15;
  } else if (value === 0) {
    return 0;
  }
  return -Math.log10(value)
};

const isManualAssociation = (ctx) => ctx.raw.pValue === 0 && ctx.raw.isSignificant;

type Props = {
  data: Array<GeneStatisticalResult>;
  cat: Cat;
  sig: boolean;
  hasDataRelatedToPWG: boolean;
};

const GraphicalAnalysisChart = (props: Props) => {
  const { data, cat, sig, hasDataRelatedToPWG } = props;
  const chartRef = useRef<Chart>(null);
  const zoomButtonsRef = useRef<HTMLDivElement>(null);
  const [zoomApplied, setZoomApplied] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const zoomDelta = 0.3;

  useEffect(() => {
    if (!!chartRef.current && zoomLevel !== 1) {
      chartRef.current.zoom({ x: 1, y: zoomLevel});
    }
  }, [zoomLevel]);

  if (!data) {
    return null;
  }

  const dataWithPValue = useMemo(() =>
    data.filter(
      (x) =>
        x.topLevelPhenotypes?.length
    )
      .map((x) => ({
        ...x,
        pValue: Number(x.pValue) || 0,
        topLevelPhenotypes: x.topLevelPhenotypes.map((y) => y.name),
      })), [data]);

  const processed = useMemo(
    () => processData(dataWithPValue, cat, sig),
    [dataWithPValue, cat, sig]
  );

  const isByProcedure = cat.type === cats.PROCEDURES;
  const colorByArray = useMemo(() =>
      isByProcedure
        ? _.uniq(processed.map((x) => x.procedureName))
        : _.uniq(processed.map((x) => x.topLevelPhenotypes[0]))
    ,[processed, isByProcedure]);

  const chartData = useMemo(() => ({
    labels: processed.map((x) => x.parameterName),
    datasets: [
      {
        label: "P-value",
        type: "line" as const,
        data: processed.map((x, index) => ({
          x: transformPValue(x.pValue, x.significant),
          y: index,
          pValue: x.pValue,
          isSignificant: x.significant,
          procedureName: x.procedureName,
          system: x.topLevelPhenotypes[0],
          color: isByProcedure ? colorArray[colorByArray.indexOf(x.procedureName)] : systemColorMap[x.topLevelPhenotypes[0]],
        })),
        backgroundColor: (ctx) => !!ctx.raw ? (!isManualAssociation(ctx) ? ctx.raw.color : transparent) : defaultColor,
        borderColor: (ctx) => !!ctx.raw ? (isManualAssociation(ctx) ? ctx.raw.color : transparent) : defaultColor,
        showLine: false,
        pointRadius: (ctx) => isManualAssociation(ctx) ? 8 : 4,
        pointHoverRadius: (ctx) => isManualAssociation(ctx) ? 11 : 7,
        pointHoverBorderWidth: (ctx) => !!ctx.raw ? (isManualAssociation(ctx) ? 3 : 1) : 2,
        borderWidth: (ctx) => !!ctx.raw ? (isManualAssociation(ctx) ? 3 : 1) : 2,
        pointStyle: (ctx) => isManualAssociation(ctx) ? "triangle" : "circle",
      },
      {
        label: 'P-value threshold',
        type: "line" as const,
        data: processed.map(() => 4),
        borderColor: "black",
        pointStyle: "rect",
        borderDash: [5, 5],
        radius: 0,
      },
      hasDataRelatedToPWG ? {
        label: 'P-value threshold',
        type: "line" as const,
        data: processed.map(() => 3),
        borderColor: "rgb(255, 99, 132)",
        pointStyle: "rect",
        borderDash: [5, 5],
        radius: 0,
      } : {}
    ],
  }), [processed, colorByArray, isByProcedure]);

  const chartOptions = {
    responsive: true,
    indexAxis: "y" as const,
    animation: false as const,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodySpacing: 12,
        padding: 12,
        titleMarginBottom: 6,
        titleFont: { size: 16 },
        labelFont: { size: 14 },
        displayColors: false,
        callbacks: {
          beforeBody: (context) => {
            const data = processed[context[0].dataIndex];
            return formatBodySystems(data.topLevelPhenotypes[0]);
          },
          label: () => "",
          afterBody: (context) => {
            const data = processed[context[0].dataIndex];
            return [
              (data.pValue === 0 && data.significant ? "Manual association" : `P-value: ${parseFloat(data.pValue).toExponential(3)}`),
              `Zygosity: ${_.capitalize(data.zygosity)}`,
              `Procedure: ${data.procedureName}`,
              (data.maleMutantCount && data.femaleMutantCount) ? `Mutants: ${data.maleMutantCount || 0} males & ${data.femaleMutantCount || 0} females` : null,
              (!!data.effectSize) ? `Effect size: ${data.effectSize}` : null,
              `Metadata group: ${data.metadataGroup}`,
            ].filter(Boolean);
          },
        },
      },
      zoom: {
        zoom: {
          limits: { y: { max: 60, min: 0 } },
          mode: "y" as const,
          onZoomComplete: (_) => {
            if (!zoomApplied) {
              setZoomApplied(true);
            }
          },
        },
        pan: {
          enabled: true,
          mode: "y" as const,
        }
      },
    },
    scales: {
      x: {
        title: { display: true, text: '-log₁₀(P-value)' },
      }
    }
  };


  return (
    <div>
      <div className={classNames(styles.labels, styles.icons)}>
        {colorByArray
          .filter(Boolean)
          .map((item, index) => {
            const color = colorArray[index];
            return (
              <span className="grey" key={item}>
                <span className={styles.icon} style={{backgroundColor: color}}>
                  {isByProcedure ? null : (
                    <BodySystemIcon name={item} color="white" size="1x"/>
                  )}
                </span>&nbsp;
                <small>{formatBodySystems(item)}</small>
              </span>
            );
          })}
        <span className="grey" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          <hr className={styles.dashedLine}/>
          <small>Significant P-value threshold (P &lt; 0.0001)</small>
        </span>
      </div>
      <div className={classNames(styles.labels, "grey")}>
        <div className={styles.figureContainer}>
          <div className={styles.circle} />
          Statistical annotations
        </div>
        <div className={styles.figureContainer}>
          <div className={styles.triangle} />
          Manual annotations:
          <i>Are assigned a value of 1x10<sup>-15</sup> in order to be displayed in the chart</i>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div ref={zoomButtonsRef} className={styles.overlay}>
          <ZoomButtons
            containerClassName={styles.buttons}
            onZoomIn={() => setZoomLevel(prevZoom => prevZoom + zoomDelta)}
            onZoomOut={() => setZoomLevel(prevZoom => prevZoom - zoomDelta)}
            onResetZoom={() => {
              if (chartRef.current) {
                chartRef.current.resetZoom();
                setZoomApplied(false);
                setZoomLevel(1.0);
              }
            }}
          />
        </div>
        <ChartEl
          type="line"
          ref={chartRef}
          options={chartOptions}
          data={chartData}
          plugins={[zoomPlugin]}
        />
      </div>
      <div className={styles.bottomLabels}>
        <span className="labels">
          {hasDataRelatedToPWG && (
            <span style={{marginLeft: '1rem'}}>
              <hr className={styles.dashedLine} style={{borderTop: "3px dashed rgb(255, 99, 132)"}} />
              Significant threshold for pain sensitivity (P &lt; 0.001)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default GraphicalAnalysisChart;