import {
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
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
  BarElement,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import errorbarsPlugin from "@/utils/chart/errorbars.plugin";
import { useEffect, useState } from "react";
import { mutantChartColors, wildtypeChartColors } from "@/utils/chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
);
const clone = obj => JSON.parse(JSON.stringify(obj));

const getPointStyle = (key: string) => {
  if (key.includes('WT')) {
    return key.includes('Female') ? 'triangle' : 'rectRot';
  } else {
    return key.includes('Female') ? 'rect' : 'circle';
  }
}

const BodyWeightChart = ({ datasetSummary }) => {
  const [data, setData] = useState({});
  const [viewOnlyRangeForMutant, setViewOnlyRangeForMutant] = useState(true);

  useEffect(() => {
    const result = {};
    const datasetClone = clone(datasetSummary);
    datasetClone.chartData?.forEach(point => {
      let label = point.sex === 'male' ? 'Male' : 'Female';
      label += point.sampleGroup === 'control' ? ' WT' : (point.zygosity === 'homozygote' ? ' Hom.' : ' Het.');
      if (result[label] === undefined) {
        result[label] = [];
      }
      if (Number.parseInt(point.ageInWeeks, 10) > 0) {
        result[label].push({
          y: point.mean,
          x: Number.parseInt(point.ageInWeeks, 10),
          yMin: point.mean - point.std,
          yMax: point.mean + point.std,
          ageInWeeks: Number.parseInt(point.ageInWeeks, 10),
          count: point.count,
        });
      }
    });
    Object.keys(result).forEach(key => {
      const values = result[key];
      values.sort((p1, p2) => p1.ageInWeeks - p2.ageInWeeks);
    })
    setData(result);
  }, [datasetSummary]);

  const getOrderedColumns = () => {
    return Object.keys(data).sort();
  };

  const getMaxAge = (absoluteAge: boolean) => {
    if (data) {
      return Object.keys(data)
        .filter(key => (viewOnlyRangeForMutant && !absoluteAge) ? !key.includes('WT') : true)
        .map(key => data[key])
        .reduce((age, datasetValues) => {
          const maxAgeByDataset = datasetValues.at(-1).ageInWeeks;
          return maxAgeByDataset > age ? maxAgeByDataset : age;
        }, 0)
    }
    return 0;
  }

  const getValuesForRow = (week: number) => {
    return getOrderedColumns().map(key => data[key]).map(dataset => {
      const value = dataset.find(point => point.ageInWeeks === week);
      return value === undefined ? '-' : `${value.y.toFixed(6)} (${value.count})`;
    })
  }

  const processData = () => {
    const maxAge = getMaxAge(false);
    const datasets = getOrderedColumns().map(key => {
      return {
        type: 'line' as const,
        label: key,
        data: data[key].filter(point => point.ageInWeeks <= maxAge),
        borderColor: key.includes('WT') ? wildtypeChartColors.halfOpacity : mutantChartColors.halfOpacity,
        backgroundColor: key.includes('WT') ? wildtypeChartColors.halfOpacity : mutantChartColors.halfOpacity,
        pointStyle: getPointStyle(key),
      }
    });
    return {
      datasets,
      labels: Array.from({ length: maxAge }, (_, index) => index + 1),
    };
  }

  const chartOptions= {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
      axis: 'y' as const
    },
    scales: {
      y: {
        min: 0,
        max: 50,
        title: {
          display: true,
          text: 'Mass (g)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Age - rounded to nearest week',
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true }
      },
      tooltip: {
        usePointStyle: true,
        title: { padding: { top: 10 } },
        callbacks: {

        }
      }
    },
  };

  const chartPlugins = [errorbarsPlugin];

  const maxAge = getMaxAge(true);

  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} displayPValueStatement={false}  />
      <Row>
        <Col lg={12}>
          <Card>
            <div style={{ position: 'relative', height: '400px' }}>
              {!!data && (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="custom-switch"
                      label="View data within mutants data range"
                      onChange={() => setViewOnlyRangeForMutant(!viewOnlyRangeForMutant)}
                      checked={viewOnlyRangeForMutant}
                    />
                  </div>
                  <Chart type="bar" options={chartOptions} data={processData()} plugins={chartPlugins} />
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
                    {getOrderedColumns().map(label => <th key={label}>{label + ' (count)'}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(maxAge)].map((week, i) => (
                    <tr key={i}>
                      <td>{i+1}</td>
                      {getValuesForRow(i).map(value => (
                        <td>{value}</td>
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
              <FontAwesomeIcon icon={faInfoCircle} /> NOTE: Data from all combinations
              will be aggregated into one download file.
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BodyWeightChart;
