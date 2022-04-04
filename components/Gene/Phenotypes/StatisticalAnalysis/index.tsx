import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
Chart.register([
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Tooltip,
  Title,
  Legend,
]);
import { allBodySystems } from "../../Summary";
import _ from "lodash";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

var colorArray = [
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

type CatType =
  | "ALL"
  | "SIGNIFICANT"
  | "SIGNIFICANT_BODY_SYSTEMS"
  | "SIGNIFICANT_PROCEDURES"
  | "BODY_SYSTEMS"
  | "PROCEDURES";

const cats: { [key: string]: CatType } = {
  ALL: "ALL",
  SIGNIFICANT: "SIGNIFICANT",
  SIGNIFICANT_BODY_SYSTEMS: "SIGNIFICANT_BODY_SYSTEMS",
  SIGNIFICANT_PROCEDURES: "SIGNIFICANT_PROCEDURES",
  BODY_SYSTEMS: "BODY_SYSTEMS",
  PROCEDURES: "PROCEDURES",
};

const options = [
  { label: "Sort by significance", category: cats.ALL },
  {
    label: "Show significant phenotypes only",
    category: cats.SIGNIFICANT,
  },
  {
    label: "Group by physiological systems",
    category: cats.SIGNIFICANT_BODY_SYSTEMS,
  },
  // {
  //   label: "All data grouped by physiological systems",
  //   category: cats.BODY_SYSTEMS,
  // },
  {
    label: "Group by precedures",
    category: cats.SIGNIFICANT_PROCEDURES,
  },
  // { label: "All data grouped by procedures", category: cats.PROCEDURES },
];

type Cat = { type: CatType; meta?: any };

const getSignificants = (data: any) => {
  return data.filter((x) => -Math.log10(x.pvalue) >= 4);
};

const processData = (data: any, { type, meta }: Cat) => {
  const {
    ALL,
    SIGNIFICANT,
    SIGNIFICANT_BODY_SYSTEMS,
    SIGNIFICANT_PROCEDURES,
    BODY_SYSTEMS,
    PROCEDURES,
  } = cats;
  const significants = getSignificants(data);
  switch (type) {
    case ALL:
      return _.sortBy(data, "pvalue");
    case SIGNIFICANT:
      return _.sortBy(getSignificants(data), "pvalue");
    case SIGNIFICANT_BODY_SYSTEMS:
      const bodySystems = significants.map((x) => x.topLevelPhenotypeTermName);
      const flattend = [].concat.apply([], bodySystems);
      const filtered = data.filter((x) => {
        return x.topLevelPhenotypeTermName.some((y) => flattend.includes(y));
      });
      return _.sortBy(filtered, "topLevelPhenotypeTermName");
    case SIGNIFICANT_PROCEDURES:
      const procedures = significants.map((x) => x.procedureName);
      const filtered2 = data.filter((x) => {
        return procedures.includes(x.procedureName);
      });
      return _.sortBy(filtered2, "procedureName");
    case BODY_SYSTEMS:
      return _.sortBy(data, "topLevelPhenotypeTermName");
    case PROCEDURES:
      return _.sortBy(data, "procedureName");
    default:
      return data;
  }
};

const StatisticalAnalysisChart = ({ data, cat }: { data: any; cat: Cat }) => {
  if (!data) {
    return null;
  }
  const hasPValue = data.geneStatisticalResults
    .filter((x) => x.pvalue !== null && x.pvalue !== undefined)
    .sort((a, b) => a.topLevelPhenotypeTermName - b.topLevelPhenotypeTermName);
  const processed = processData(hasPValue, cat);
  const labels = processed.map((x) => x.parameterName);
  const values = processed.map((x) => -Math.log10(Number(x.pvalue)));
  const isByProcedure =
    cat.type === cats.SIGNIFICANT_PROCEDURES || cat.type === cats.PROCEDURES;
  let colorByArray = [];
  if (isByProcedure) {
    colorByArray = _.uniq(processed.map((x) => x.procedureName));
  } else {
    colorByArray = allBodySystems;
  }
  const colors = processed.map((x) => {
    let index = 0;
    if (isByProcedure) {
      index = colorByArray.indexOf(x.procedureName);
      console.log(index, colorByArray, x.procedureName);
    } else {
      index = colorByArray.indexOf(x.topLevelPhenotypeTermName[0]);
      console.log(index, colorByArray, x.topLevelPhenotypeTermName[0]);
    }
    return colorArray[index];
  });

  return (
    <div>
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom" as const,
            },
            tooltip: {
              callbacks: {
                afterBody: (context) => {
                  console.log(context);
                  return "Test";
                },
              },
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: "P-value",
              data: values,
              backgroundColor: colors,
              showLine: false,
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        }}
      />
    </div>
  );
};

const StatisticalAnalysis = ({ data }) => {
  const [cat, setCat] = useState<Cat | null>(null);
  const setCatType = (type: CatType) => {
    setCat({
      type,
    });
  };
  const isSignificant = cat && cat.type.includes("SIGNIFICANT");
  const handleToggle = () => {
    if (cat.type === cats.SIGNIFICANT) {
      setCatType(cats.ALL);
    } else if (isSignificant) {
      setCatType(cats[cat.type.replace("SIGNIFICANT_", "")]);
    } else if (cat.type === cats.ALL) {
      setCatType(cats.SIGNIFICANT);
    } else {
      setCatType(cats[`SIGNIFICANT_${cat.type}`]);
    }
  };
  if (cat) {
    const title = cat.type.includes("PROCEDURE")
      ? "Measurements by Procedures"
      : cat.type.includes("SYSTEM")
      ? "Measurements by Physiological Systems"
      : "Measurements";
    return (
      <>
        <h4>{title}</h4>
        <p>
          <button onClick={() => setCat(null)}>Back</button>
          {
            <button onClick={handleToggle}>
              <FontAwesomeIcon
                icon={isSignificant ? faCheckSquare : faSquare}
              />{" "}
              Only show significant
            </button>
          }
        </p>
        <StatisticalAnalysisChart data={data} cat={cat} />
      </>
    );
  } else {
    return (
      <div style={{ paddingTop: "3rem" }}>
        <h4>How would you like to view your data?</h4>
        <ul style={{ padding: 0, marginTop: "2rem" }}>
          {options.map(({ label, category }) => (
            <li style={{ listStyle: "none", marginBottom: "1rem" }}>
              <button onClick={() => setCat({ type: category })}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default StatisticalAnalysis;
