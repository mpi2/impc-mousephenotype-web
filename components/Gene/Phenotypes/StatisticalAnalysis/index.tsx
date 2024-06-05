import "chart.js/auto";
import { Chart } from "chart.js";
import { Chart as ChartEl } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import _ from "lodash";
import { useRef, useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.scss";
import BodySystemIcon from "@/components/BodySystemIcon";
import { formatBodySystems, getUniqObjects } from "@/utils";
import { Form } from "react-bootstrap";
import { GeneStatisticalResult } from "@/models/gene";
import { ZoomButtons } from "@/components";

Chart.register(zoomPlugin);

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

type CatType = "ALL" | "BODY_SYSTEMS" | "PROCEDURES";

const cats: { [key: string]: CatType } = {
  ALL: "ALL",
  BODY_SYSTEMS: "BODY_SYSTEMS",
  PROCEDURES: "PROCEDURES",
};

const options = [
  {
    label: "None",
    category: cats.SIGNIFICANT,
  },
  {
    label: "Physiological systems",
    category: cats.BODY_SYSTEMS,
  },

  {
    label: "Procedures",
    category: cats.PROCEDURES,
  },
  // { label: "Sort all by significance", category: cats.ALL },
];

type Cat = { type: CatType; meta?: any };

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

const StatisticalAnalysisChart = ({
  data,
  cat,
  sig,
  hasDataRelatedToPWG,
  isVisible,
}: {
  data: Array<GeneStatisticalResult>;
  cat: Cat;
  sig: boolean;
  hasDataRelatedToPWG: boolean;
  isVisible: boolean;
}) => {
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
        x.pValue !== null &&
        x.pValue !== undefined &&
        x.topLevelPhenotypes?.length
    )
    .map((x) => ({
      ...x,
      pValue: Number(x.pValue),
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
        data: processed.map((x) => -Math.log10(Number(x.pValue))),
        backgroundColor: processed.map((x) => {
          let index = 0;
          if (isByProcedure) {
            index = colorByArray.indexOf(x.procedureName);
          } else {
            index = colorByArray.indexOf(x.topLevelPhenotypes[0]);
          }
          return colorArray[index];
        }),
        showLine: false,
        pointRadius: 5,
        pointHoverRadius: 8,
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
  }), [processed, colorByArray]);

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
              `P-value: ${parseFloat(data.pValue).toExponential(3)}`,
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
      <div style={{marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem"}}>
        {colorByArray.map((item, index) => {
          if (!item) {
            return;
          }
          const color = colorArray[index];
          return (
            <span className="grey">
              <span
                style={{
                  display: "inline-flex",
                  width: "1.4em",
                  height: "1.4em",
                  backgroundColor: color,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3,
                  verticalAlign: "middle",
                  marginRight: 3,
                }}
              >
                {isByProcedure ? null : (
                  <BodySystemIcon name={item} color="white" size="1x"/>
                )}
              </span>{" "}
              <small>{formatBodySystems(item)}</small>
            </span>
          );
        })}
        <span className="grey" style={{ display: 'inline-block', marginBlock: '3px', whiteSpace: 'nowrap' }}>
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
          <small>Significant P-value threshold (P &lt; 0.0001)</small>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "700px"
        }}
      >
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
        />
      </div>
      <div style={{display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
        <span className="labels">
          {hasDataRelatedToPWG && (
            <span style={{marginLeft: '1rem'}}>
              Significant threshold for pain sensitivity (P &lt; 0.001)
              <hr
                style={{
                  border: "none",
                  borderTop: "3px dashed rgb(255, 99, 132)",
                  height: "3px",
                  width: "50px",
                  display: 'inline-block',
                  margin: '0 0 0 0.5rem',
                  opacity: 1
                }}
              />
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

const StatisticalAnalysis = (
  { data, isVisible } : { data: Array<GeneStatisticalResult>, isVisible: boolean }
) => {
  const [cat, setCat] = useState<Cat | null>({
    type: cats.BODY_SYSTEMS,
  });
  const [significantOnly, setSignificantOnly] = useState<boolean>(false);
  if (
    !data ||
    !data.some(
      (x) =>
        x.pValue !== null &&
        x.pValue !== undefined &&
        x.topLevelPhenotypes?.length
    )
  ) {
    return null;
  }

  const filteredData = useMemo(
    () => getUniqObjects(data, ["topLevelPhenotypes", "projectName"]),
    [data]
  );

  const handleToggle = () => {
    setSignificantOnly(!significantOnly);
  };

  const significantSuffix = (() => {
    if (cat.type === cats.BODY_SYSTEMS) {
      return "physiological systems";
    } else if (cat.type === cats.PROCEDURES) {
      return "procedures";
    }
    return "";
  })();

  const hasDataRelatedToPWG = data.some(item => item.projectName === 'PWG');

  return (
    <>
      <div
        style={{
          paddingLeft: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <p>
          <label
            htmlFor="groupBy"
            className="grey"
            style={{ marginRight: "0.5rem" }}
          >
            Include in groups:
          </label>
          <Form.Select
            style={{ display: "inline-block", width: 280, marginRight: "2rem" }}
            aria-label="Group by"
            // value={cat.type}
            defaultValue={cat.type}
            id="groupBy"
            className="bg-white"
            onChange={(el) => {
              setCat({ type: el.target.value as CatType });
            }}
          >
            {options.map(({ label, category }) => (
              <option value={category}>{label}</option>
            ))}
          </Form.Select>
          <button onClick={handleToggle} className={styles.inlineButton}>
            <FontAwesomeIcon
              icon={significantOnly ? faCheckSquare : faSquare}
              className={significantOnly ? "primary" : "grey"}
            />{" "}
            Only show significant {significantSuffix}
          </button>
        </p>
      </div>
      <StatisticalAnalysisChart
        data={filteredData}
        cat={cat}
        sig={significantOnly}
        hasDataRelatedToPWG={hasDataRelatedToPWG}
        isVisible={isVisible}
      />
    </>
  );
};

export default StatisticalAnalysis;
