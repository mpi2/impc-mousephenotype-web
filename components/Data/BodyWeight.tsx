import {
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import ChartSummary from "./ChartSummary";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { useRouter } from "next/router";
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

const getPointStyle = (key: string) => {
  if (key.includes('WT')) {
    return key.includes('Female') ? 'triangle' : 'rectRot';
  } else {
    return key.includes('Female') ? 'rect' : 'circle';
  }
}

const BodyWeightChart = ({ datasetSummary, mgiGeneAccessionId }) => {
  const router = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: ['genes', mgiGeneAccessionId, 'bodyweight'],
    queryFn: () => fetchAPI(`/api/v1/bodyweight/byMgiGeneAccId?mgiGeneAccId=${mgiGeneAccessionId}`),
    enabled: router.isReady && !!mgiGeneAccessionId,
    placeholderData: () => { return { datasets: [], labels: [] }},
    select: response => {
      const result = {};
      const data = response[0];
      data.dataPoints.forEach(point => {
        let label = point.sex === 'male' ? 'Male' : 'Female';
        label += point.sampleGroup === 'control' ? ' WT' : (point.zygosity === 'homozygote' ? ' Hom.' : ' Het.');
        if (result[label] === undefined) {
          result[label] = [];
        }
        result[label].push({
          y: point.mean,
          x: point.ageInWeeks,
          yMin: point.mean - point.std,
          yMax: point.mean + point.std,
          ageInWeeks: point.ageInWeeks,
        });
      });
      return {
        datasets: Object.keys(result).map(key => {
          return {
            type: 'line' as const,
            label: key,
            data: result[key].sort((p1, p2) => p1.ageInWeeks - p2.ageInWeeks),
            borderColor: key.includes('WT') ? 'rgb(67, 147, 195, 0.5)' : 'rgb(214, 96, 77, 0.5)',
            backgroundColor: key.includes('WT') ? 'rgb(67, 147, 195, 0.5)' : 'rgb(214, 96, 77, 0.5)',
            pointStyle: getPointStyle(key),
          }
        }),
        labels: Array.from({ length: 81 }, (_, index) => (index + 1).toString(10)),
      };
    },
  });
  console.log(data);

  const chartOptions= {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    scales: {
      yAxis: {
        min: 0,
        max: 70,
        title: {
          display: true,
          text: 'Mass (g)',
        },
      },
      xAxis: {
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
          label: ctx => {
            const minValue = ctx.raw.yMin.toFixed(2);
            const maxValue = ctx.raw.yMax.toFixed(2);
            return `${ctx.dataset.label}: ${ctx.formattedValue} (SD: ${minValue} - ${maxValue})`
          },
          title: ctx => {
            console.log(ctx);
            return 'Age - Rounded to nearest week ' + ctx[0].label;
          }
        }
      }
    },
  };

  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} />
      <Row>
        <Col lg={12}>
          <Card>
            <div style={{ position: 'relative', height: '400px' }}>
              {!!data && (
                <Chart type="bar" options={chartOptions} data={data} />
              )}
            </div>
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
              <FontAwesomeIcon icon={faInfoCircle} /> NOTE: Data from all charts
              will be aggregated into one download file.
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BodyWeightChart;
