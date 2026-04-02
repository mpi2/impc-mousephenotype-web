import { Col, Form, Row, Table } from "react-bootstrap";
import Card from "@/components/Card";
import ChartSummary from "./ChartSummary/ChartSummary";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  LineWithErrorBarsController,
  PointWithErrorBar,
} from "chartjs-chart-error-bars";
import { useMemo, useState } from "react";
import { mutantChartColors, wildtypeChartColors } from "@/utils/chart";
import { BodyWeightLinePlot } from "./Plots/BodyWeightLinePlot";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineWithErrorBarsController,
  PointWithErrorBar,
);

type ChartDatapoint = {
  y: number;
  x: number;
  yMin: number;
  yMax: number;
  ageInWeeks: number;
  count: number;
  sd: number;
  monthNum?: number;
};

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const getPointStyle = (key: string) => {
  if (key.includes("WT")) {
    return key.includes("Female") ? "triangle" : "rectRot";
  } else {
    return key.includes("Female") ? "rect" : "circle";
  }
};

const aggregateDatasets = (data: Record<string, Array<ChartDatapoint>>) => {
  const result: Record<string, Array<ChartDatapoint>> = {};
  for (const key of Object.keys(data)) {
    const dataset = data[key];
    const weekMap = new Map<number, Array<ChartDatapoint>>();
    for (const point of dataset) {
      if (!weekMap.has(point.ageInWeeks)) {
        weekMap.set(point.ageInWeeks, []);
      }
      weekMap.get(point.ageInWeeks)!.push(point);
    }
    result[key] = Array.from(weekMap.values()).map((entry) => {
      const totalCount = entry.reduce((sum, e) => sum + e.count, 0);
      const y = entry.reduce((sum, e) => sum + e.y, 0);
      const yMin = Math.min(...entry.map((e) => e.yMin));
      const yMax = Math.max(...entry.map((e) => e.yMax));
      const variance =
        entry.reduce((sum, e) => sum + e.count * e.sd ** 2, 0) / totalCount;
      const sd = Math.sqrt(variance);
      return {
        y,
        yMin,
        yMax,
        sd,
        x: entry[0].ageInWeeks,
        ageInWeeks: entry[0].ageInWeeks,
        count: totalCount,
      };
    });
  }
  return result;
};

const groupLastWeeksIntoMonths = (
  data: Record<string, Array<ChartDatapoint>>,
) => {
  const updatedResult: Record<string, Array<ChartDatapoint>> = {};
  for (const key of Object.keys(data)) {
    const dataset = data[key];
    const weeklyDatasetPos = dataset.findLastIndex(
      (point) => point.ageInWeeks === 17,
    );
    updatedResult[key] = [...dataset.slice(0, weeklyDatasetPos)];
    const maxWeek = Math.max(...dataset.map((w) => w.ageInWeeks));
    for (let currentWeek = 17; currentWeek <= maxWeek; currentWeek += 4) {
      const chunk = dataset.filter(
        (point) =>
          point.ageInWeeks >= currentWeek && point.ageInWeeks < currentWeek + 4,
      );
      if (chunk.length === 0) {
        continue;
      }
      const totalCount = chunk.reduce((sum, point) => sum + point.count, 0);
      const y = chunk.reduce((sum, point) => sum + point.y, 0) / chunk.length;
      const yMin = Math.min(...chunk.map((point) => point.yMin));
      const yMax = Math.max(...chunk.map((point) => point.yMax));
      const variance =
        chunk.reduce((sum, point) => sum + point.count * point.sd ** 2, 0) /
        totalCount;
      const sd = Math.sqrt(variance);
      updatedResult[key].push({
        y,
        yMin,
        yMax,
        sd,
        x: currentWeek,
        ageInWeeks: currentWeek,
        count: totalCount,
        monthNum: Math.floor(currentWeek / 4) + 1,
      });
    }
  }
  return updatedResult;
};

const BodyWeightChart = ({ datasetSummary }) => {
  const [viewOnlyRangeForMutant, setViewOnlyRangeForMutant] = useState(true);

  const data = useMemo(() => {
    const result: Record<string, Array<ChartDatapoint>> = {};
    const datasetClone = clone(datasetSummary);
    datasetClone.chartData?.forEach((point) => {
      let label = point.sex === "male" ? "Male" : "Female";
      label +=
        point.sampleGroup === "control"
          ? " WT"
          : point.zygosity === "homozygote"
            ? " Hom."
            : " Het.";
      if (result[label] === undefined) {
        result[label] = [];
      }
      const ageInWeeks = Number.parseInt(point.ageInWeeks);
      if (ageInWeeks > 0) {
        result[label].push({
          y: parseFloat(point.mean.toPrecision(5)),
          x: ageInWeeks,
          yMin: parseFloat((point.mean - point.std).toPrecision(5)),
          yMax: parseFloat((point.mean + point.std).toPrecision(5)),
          ageInWeeks: ageInWeeks,
          count: point.count,
          sd: point.std || 0,
        });
      }
    });
    Object.keys(result).forEach((key) => {
      result[key] = result[key].toSorted(
        (p1, p2) => p1.ageInWeeks - p2.ageInWeeks,
      );
    });
    //  const aggregatedDatasets = aggregateDatasets(result);
    return groupLastWeeksIntoMonths(result);
  }, [datasetSummary]);

  const getOrderedColumns = () => {
    return Object.keys(data).sort();
  };

  const getMaxAge = (absoluteAge: boolean): number => {
    if (data) {
      return Object.keys(data)
        .filter((key) =>
          viewOnlyRangeForMutant && !absoluteAge ? !key.includes("WT") : true,
        )
        .map((key) => data[key])
        .reduce((age, datasetValues) => {
          const maxAgeByDataset = datasetValues.at(-1).ageInWeeks;
          return maxAgeByDataset > age ? maxAgeByDataset : age;
        }, 0);
    }
    return 0;
  };

  const getMinAge = (): number => {
    if (data) {
      return Object.keys(data)
        .filter((key) => (viewOnlyRangeForMutant ? !key.includes("WT") : true))
        .map((key) => data[key])
        .reduce((age, datasetValues) => {
          const maxAgeByDataset = datasetValues.at(0).ageInWeeks;
          return maxAgeByDataset < age ? maxAgeByDataset : age;
        }, Number.MAX_SAFE_INTEGER);
    }
    return 0;
  };

  const getValuesForRow = (week: number) => {
    return getOrderedColumns()
      .map((key) => data[key])
      .map((dataset) => {
        const value = dataset.find((point) => point.ageInWeeks === week);
        return value === undefined
          ? "-"
          : `${value.y.toFixed(6)} (${value.count})`;
      });
  };

  const generateDataset = (data: Array<any>, labels: Array<number>) => {
    return labels.map((label) => {
      const pointToAdd = data.find((point) => point.ageInWeeks === label);
      return !!pointToAdd
        ? pointToAdd
        : {
            ageInWeeks: label,
            count: 0,
            x: label,
            y: null,
            yMax: 0,
            yMin: 0,
          };
    });
  };

  const processData = () => {
    const maxAge = getMaxAge(false);
    const minAge = getMinAge();
    const weekLabels = Array.from(
      { length: maxAge },
      (_, index) => minAge + index,
    );
    const datasets = getOrderedColumns().map((key) => {
      const dataSetColor = key.includes("WT")
        ? wildtypeChartColors.halfOpacity
        : mutantChartColors.halfOpacity;
      return {
        label: key,
        data: generateDataset(data[key], weekLabels),
        borderColor: dataSetColor,
        backgroundColor: dataSetColor,
        errorBarColor: dataSetColor,
        errorBarWhiskerColor: dataSetColor,
        pointStyle: getPointStyle(key),
        spanGaps: true,
      };
    });
    return {
      datasets,
      labels: weekLabels,
    };
  };

  const maxYMax = useMemo(() => {
    return (
      Math.max(
        ...Object.values(data).flatMap((values) =>
          values.map((val) => val.yMax),
        ),
      ) + 5
    );
  }, [data]);

  const minYMin = useMemo(() => {
    return (
      Math.min(
        ...Object.values(data).flatMap((values) =>
          values.map((val) => val.yMin),
        ),
      ) - 5
    );
  }, [data]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index" as const,
        axis: "y" as const,
      },
      scales: {
        y: {
          min: minYMin,
          max: maxYMax,
          title: {
            display: true,
            text: "Mass (g)",
          },
        },
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: "Age - rounded to nearest week",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: { usePointStyle: true },
        },
        tooltip: {
          usePointStyle: true,
          title: { padding: { top: 10 } },
          mode: "x",
          callbacks: {
            title: (ctx) => `Age - Rounded To Nearest Week ${ctx?.[0]?.label}`,
            label: (ctx) =>
              `${ctx.dataset.label} (count: ${ctx.raw.count}) Mass: ${ctx.raw.y}g SD: ${ctx.raw.yMin}-${ctx.raw.yMax}`,
          },
        },
      },
    }),
    [maxYMax, minYMin],
  );

  const maxAge = getMaxAge(true);
  const chartData = useMemo(
    () => processData(),
    [data, viewOnlyRangeForMutant],
  );

  return (
    <>
      <ChartSummary
        datasetSummary={datasetSummary}
        displayPValueStatement={false}
        displayAssociatedPhenotype={false}
      />
      <Row>
        <Col lg={12}>
          <Card style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <div style={{ position: "relative", height: "400px" }}>
              {!!data && (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="custom-switch"
                      label="View data within mutants data range"
                      onChange={() =>
                        setViewOnlyRangeForMutant(!viewOnlyRangeForMutant)
                      }
                      checked={viewOnlyRangeForMutant}
                    />
                  </div>
                  <BodyWeightLinePlot options={chartOptions} data={chartData} />
                </>
              )}
            </div>
          </Card>
          <Card>
            {!!data && (
              <Table striped>
                <thead>
                  <tr>
                    <th>Week</th>
                    {getOrderedColumns().map((label) => (
                      <th key={label}>{label + " (count)"}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(maxAge)].map((week, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      {getValuesForRow(i + 1).map((value, internalI) => (
                        <td key={internalI}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BodyWeightChart;
