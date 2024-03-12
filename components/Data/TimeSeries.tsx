import {
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ButtonGroup,
  Col,
  Row,
  Table,
  ToggleButton,
} from "react-bootstrap";
import Card from "@/components/Card";
import ChartSummary from "./ChartSummary";
import LineChart from "./Plots/TimeSeriesLinePlot";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import _ from "lodash";
import { useState } from "react";

type ChartSeries = {
  data: Array<any>;
  sampleGroup: "control" | "experimental";
  sex: "male" | "female";
};

// Function to group data by a property
const groupBy = (data, key) => {
  return data.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

const calculateStats = (groupedData, valueKey, windowSize = 1) => {
  return groupedData.map((group) => {
    // Calculate average
    const avg =
      group.values.reduce((sum, item) => sum + item[valueKey], 0) /
      group.values.length;

    // Calculate standard deviation
    const sd = Math.sqrt(
      group.values.reduce(
        (sum, item) => sum + Math.pow(item[valueKey] - avg, 2),
        0
      ) / group.values.length
    );

    return {
      group: group.key,
      average: avg,
      standardDeviation: sd,
      values: group.values,
    };
  });
};

const calculateMovingAverage = (data, windowSize) => {
  const movingAverages = [];

  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      movingAverages.push(null); // Placeholder for initial values
    } else {
      let sum = 0;
      for (let j = i - windowSize + 1; j <= i; j++) {
        sum += data[j].y;
      }
      const average = sum / windowSize;
      movingAverages.push(average);
    }
  }

  return movingAverages;
};

const countSpecimens = (series, sex: string, sampleGroup: string) => {
  const selectedSeries = series.find(
    (s) => s.sampleGroup === sampleGroup && s.specimenSex === sex
  );
  if (!selectedSeries) return 0;
  return new Set(selectedSeries.observations.map((d) => d.specimenId)).size;
};

const TimeSeries = ({ datasetSummary, isVisible }) => {
  const [radioValue, setRadioValue] = useState("average");
  const getLineSeries = (dataSeries, sex, sampleGroup) => {
    if (!dataSeries) {
      return null;
    }

    const seriesData =
      dataSeries.find(
        (p) => p.sampleGroup === sampleGroup && p.specimenSex === sex
      )?.["observations"] || [];

    const groupedData = groupBy(seriesData, "discretePoint");

    const data = calculateStats(
      Object.keys(groupedData).map((key) => ({
        key,
        values: groupedData[key],
      })),
      "dataPoint"
    )
      .map((p) => {
        const p2 = { ...p };
        p2.x = +p.group;
        p2.y = p.average;
        return p2;
      })
      .sort((a, b) => (a.x > b.x ? 1 : -1));

    const smaData = calculateSMA(seriesData).map((p) => {
      const p2 = { ...p };
      p2.x = +p.discretePoint;
      p2.y = p.value;
      return p2;
    });

    return {
      id: `${sex} ${sampleGroup}`,
      sex,
      sampleGroup,
      data: data,
      originalData: data,
      smaData: smaData,
    };
  };

  function calculateSMA(data) {
    // Sort the data by the discretePoint field
    data.sort((a, b) => a.discretePoint - b.discretePoint);

    // Initialize variables
    let smaData = [];
    let sum = 0;
    let count = 0;
    let currentHour = null;

    // Loop through the data
    data.forEach((point) => {
      const hour = Math.floor(point.discretePoint);

      // If a new hour begins, calculate the average for the previous hour
      if (hour !== currentHour) {
        if (currentHour !== null) {
          const average = sum / count;
          smaData.push({ discretePoint: currentHour, value: average });
        }
        currentHour = hour;
        sum = 0;
        count = 0;
      }

      // Add the dataPoint to the sum and increment the count
      sum += point.dataPoint;
      count++;
    });

    // Calculate the average for the last hour
    if (count > 0) {
      const average = sum / count;
      smaData.push({ discretePoint: currentHour, value: average });
    }

    return smaData;
  }

  const filterChartSeries = (zygosity: string, seriesArray: Array<any>) => {
    if (zygosity === "hemizygote") {
      return seriesArray.filter((c) => c.sex === "male");
    }
    const validExperimentalSeries = seriesArray.filter(
      (c) => c.sampleGroup === "experimental" && c.data.length > 0
    );
    const validExperimentalSeriesSexes = validExperimentalSeries.map(
      (c) => c.sex
    );
    const controlSeries = seriesArray.filter(
      (c) =>
        c.sampleGroup === "control" &&
        validExperimentalSeriesSexes.includes(c.sex)
    );
    return [...controlSeries, ...validExperimentalSeries];
  };

  const updateSummaryStatistics = (chartSeries: Array<ChartSeries>) => {
    const zygosity = datasetSummary.zygosity;
    return chartSeries.map((serie) => {
      const { sampleGroup, sex } = serie;
      const sampleGroupKey = sampleGroup === "control" ? "Control" : "Mutant";
      const meanKey = `${sex}${sampleGroupKey}Mean`;
      const stddevKey = `${sex}${sampleGroupKey}Sd`;
      return {
        label: `${_.capitalize(sex)} ${
          sampleGroup === "control" ? "Control" : _.capitalize(zygosity)
        }`,
        mean: datasetSummary.summaryStatistics?.[meanKey].toFixed(3) || 0,
        stddev: datasetSummary.summaryStatistics?.[stddevKey].toFixed(3) || 0,
        count:
          new Set(
            serie.originalData.flatMap((d) => d.values).map((v) => v.specimenId)
          ).size || 0,
      };
    });
  };
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [
      "dataset",
      datasetSummary.parameterName,
      datasetSummary.datasetId,
    ],
    queryFn: () => {
      const dataReleaseVersion =
        process.env.NEXT_PUBLIC_DR_DATASET_VERSION || "latest";
      return fetch(
        `https://impc-datasets.s3.eu-west-2.amazonaws.com/${dataReleaseVersion}/${datasetSummary["datasetId"]}.json`
      ).then((res) => res.json());
    },
    select: (response) => {
      const dataSeries = response.series;
      const femaleWTPoints = getLineSeries(dataSeries, "female", "control");
      const maleWTPoints = getLineSeries(dataSeries, "male", "control");
      const femaleHomPoints = getLineSeries(
        dataSeries,
        "female",
        "experimental"
      );
      const maleHomPoints = getLineSeries(dataSeries, "male", "experimental");
      const chartSeries = filterChartSeries(datasetSummary.zygosity, [
        femaleWTPoints,
        maleWTPoints,
        femaleHomPoints,
        maleHomPoints,
      ]);

      const summaryStatistics = updateSummaryStatistics(chartSeries);

      return {
        chartSeries,
        summaryStatistics,
        computedCounts: {
          summaryStatistics: {
            femaleMutantCount: countSpecimens(
              dataSeries,
              "female",
              "experimental"
            ),
            maleMutantCount: countSpecimens(dataSeries, "male", "experimental"),
            femaleControlCount: countSpecimens(dataSeries, "female", "control"),
            maleControlCount: countSpecimens(dataSeries, "male", "control"),
          },
        },
      };
    },
    enabled: isVisible,
  });

  const displaySeries = data
    ? data.chartSeries.map((s) => {
        s["data"] = radioValue === "average" ? s.originalData : s.smaData;
        return s;
      })
    : [];
  const getTableData = (chartSeries) => {
    const indexByTimePoint = chartSeries
      .flatMap((s) =>
        s.originalData.map((d) => {
          return { ...d, id: s.id };
        })
      )
      .reduce((indexByTimePoint, item) => {
        indexByTimePoint[item.group] = indexByTimePoint[item.group]
          ? indexByTimePoint[item.group]
          : {};
        indexByTimePoint[item.group][item.id] = indexByTimePoint[item.group][
          item.id
        ]
          ? indexByTimePoint[item.group][item.id]
          : {};
        indexByTimePoint[item.group][item.id] = item.y;
        return indexByTimePoint;
      }, {});

    const timePoints = Object.keys(indexByTimePoint).sort((a, b) => a - b);

    const rows = timePoints.map((timePoint) => {
      return [timePoint].concat(
        chartSeries.map((s) =>
          indexByTimePoint[timePoint][s.id]
            ? indexByTimePoint[timePoint][s.id]
            : null
        )
      );
    });
    return {
      headers: [datasetSummary["unit"]["x"] || "Time point"].concat(
        chartSeries.map((s) => s.id)
      ),
      rows,
    };
  };

  const tableData = getTableData(data?.chartSeries || []);

  return (
    <>
      {" "}
      <ChartSummary
        datasetSummary={
          data
            ? Object.assign({}, datasetSummary, data.computedCounts)
            : datasetSummary
        }
      />
      <Row>
        <Col lg={12}>
          <Card>
            <ButtonGroup className="mb-2">
              <ToggleButton
                id={`radio-average`}
                type="radio"
                variant="primary"
                name="radio"
                value="average"
                checked={radioValue === "average"}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                Average per time point
              </ToggleButton>
              <ToggleButton
                id={`radio-sma`}
                type="radio"
                variant="primary"
                name="radio"
                value="sma"
                checked={radioValue === "sma"}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                Average per hour
              </ToggleButton>
            </ButtonGroup>
            <LineChart
              data={displaySeries}
              displayAreas={radioValue === "average"}
              unitX={datasetSummary["unit"]["x"] || "Time point"}
              unitY={datasetSummary["unit"]["y"]}
            />
          </Card>
        </Col>
        <Col lg={12}>
          <Card>
            {!!data && (
              <Table striped>
                <thead>
                  <tr>
                    {tableData.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((col, i) => (
                        <td key={i}>{col}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Access the results programmatically</h2>
            <p>
              <a
                target="_blank"
                className="link"
                href="https://www.ebi.ac.uk/mi/impc/solr/statistical-result/select?q=*:*&rows=2147483647&sort=p_value+asc&wt=xml&fq=marker_accession_id:%22MGI:1929293%22&fq=phenotyping_center:(%22MRC+Harwell%22)&fq=metadata_group:a8ee4a7178561c567069d111ea7338b8&fq=allele_accession_id:%22MGI:5548707%22&fq=pipeline_stable_id:HRWL_001&fq=parameter_stable_id:IMPC_HEM_037_001&fq=zygosity:homozygote&fq=strain_accession_id:MGI\:2164831"
              >
                Statistical result raw XML{" "}
                <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
              </a>
            </p>
            <p>
              <a
                target="_blank"
                className="link"
                href="https://www.ebi.ac.uk/mi/impc/solr/genotype-phenotype/select?q=*:*&rows=2147483647&sort=p_value+asc&wt=xml&fq=marker_accession_id:%22MGI:1929293%22&fq=phenotyping_center:(%22MRC+Harwell%22)&fq=allele_accession_id:%22MGI:5548707%22&fq=pipeline_stable_id:HRWL_001&fq=parameter_stable_id:IMPC_HEM_037_001&fq=zygosity:homozygote&fq=strain_accession_id:MGI\:2164831"
              >
                Genotype phenotype raw XML{" "}
                <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
              </a>
            </p>
            <p>
              <a
                target="_blank"
                className="link"
                href="https://www.mousephenotype.org/data/exportraw?phenotyping_center=MRC%20Harwell&parameter_stable_id=IMPC_HEM_037_001&allele_accession_id=MGI:5548707&strain=MGI:2164831&pipeline_stable_id=HRWL_001&&zygosity=homozygote&"
              >
                PhenStat-ready raw experiment data{" "}
                <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
              </a>
            </p>
          </Card>
        </Col>
        <Col>
          <Card>
            <h2>Download all the data</h2>
            <p>
              Export data as:{" "}
              <Button>
                <FontAwesomeIcon icon={faDownload} /> TSV
              </Button>{" "}
              or{" "}
              <Button>
                <FontAwesomeIcon icon={faDownload} /> XLS
              </Button>{" "}
            </p>
            <p className="grey">
              <FontAwesomeIcon icon={faInfoCircle} /> NOTE: Data from all
              combinations will be aggregated into one download file.
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TimeSeries;
