import {
  faChevronRight,
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Card from "../Card";
import SortableTable from "../SortableTable";
import UnidimensionalBoxPlot from "./Plots/UnidimensionalBoxPlot";
import UnidimensionalScatterPlot from "./Plots/UnidimensionalScatterPlot";
import { formatPValue } from "@/utils";
import ChartSummary from "./ChartSummary";
import { Dataset } from "@/models";
import _ from "lodash";
import StatisticalMethodTable from './StatisticalMethodTable';
import { useQuery } from "@tanstack/react-query";

type ChartSeries = {
  data: Array<any>,
  sampleGroup: 'control' | 'experimental',
  sex: 'male' | 'female',
}

type Props = {
  datasetSummary: Dataset;
  isVisible: boolean;
};
const Unidimensional = ({ datasetSummary, isVisible }: Props) => {
  const getScatterSeries = (dataSeries, sex, sampleGroup) => {
    if (!dataSeries) {
      return null;
    }
    const data = dataSeries
      .find((p) => p.sampleGroup === sampleGroup && p.specimenSex === sex)?.["observations"].map((p) => {
        const p2 = { ...p };
        p2.x = moment(p.dateOfExperiment);
        p2.y = +p.dataPoint;
        return p2;
      }) || [];
    return {
      sex,
      sampleGroup,
      data,
    };
  };

  const filterChartSeries = (zygosity: string, seriesArray: Array<ChartSeries>) => {
    if (zygosity === 'hemizygote') {
      return seriesArray.filter(c => c.sex === 'male');
    }
    const validExperimentalSeries = seriesArray
      .filter(c => c.sampleGroup === 'experimental' && c.data.length > 0);
    const validExperimentalSeriesSexes = validExperimentalSeries.map(c => c.sex);
    const controlSeries = seriesArray
      .filter(c => c.sampleGroup === 'control' && validExperimentalSeriesSexes.includes(c.sex));
    return [ ...controlSeries, ...validExperimentalSeries ];
  };

  const updateSummaryStatistics = (chartSeries: Array<ChartSeries>) => {
    const zygosity = datasetSummary.zygosity;
    return chartSeries.map(serie => {
      const { sampleGroup, sex } = serie;
      const sampleGroupKey = sampleGroup === 'control' ? 'Control' : 'Mutant';
      const meanKey = `${sex}${sampleGroupKey}Mean`;
      const stddevKey = `${sex}${sampleGroupKey}Sd`;
      const countKey = `${sex}${sampleGroupKey}Count`;
      return {
        label: `${_.capitalize(sex)} ${sampleGroup === 'control' ? 'Control' : _.capitalize(zygosity)}`,
        mean: datasetSummary.summaryStatistics?.[meanKey].toFixed(3) || 0,
        stddev: datasetSummary.summaryStatistics?.[stddevKey].toFixed(3) || 0,
        count: datasetSummary.summaryStatistics?.[countKey] || 0,
      }
    });
  }

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["dataset", datasetSummary.parameterName, datasetSummary.datasetId],
    queryFn: () => {
      const dataReleaseVersion = process.env.NEXT_PUBLIC_DR_DATASET_VERSION || 'latest';
      return fetch(
        `https://impc-datasets.s3.eu-west-2.amazonaws.com/${dataReleaseVersion}/${datasetSummary["datasetId"]}.json`
      ).then((res) => res.json());
    },
    select: (response) => {
      const dataSeries = response.series;
      const femaleWTPoints = getScatterSeries(
        dataSeries,
        "female",
        "control"
      );
      const maleWTPoints = getScatterSeries(dataSeries, "male", "control");
      const femaleHomPoints = getScatterSeries(
        dataSeries,
        "female",
        "experimental"
      );
      const maleHomPoints = getScatterSeries(
        dataSeries,
        "male",
        "experimental"
      );
      const windowPoints = [...dataSeries.flatMap((s) => s.observations)]
        .filter((p) => p.windowWeight)
        .map((p) => {
          const windowP = { ...p };
          windowP.x = moment(p.dateOfExperiment);
          const weigth = p.windowWeight ? +p.windowWeight : null;
          windowP.y = weigth;
          return windowP;
        });
      windowPoints.sort((a, b) => a.x - b.x);

      const chartSeries = filterChartSeries(
        datasetSummary.zygosity, [femaleWTPoints, maleWTPoints, femaleHomPoints, maleHomPoints]
      );
      return {
        chartSeries,
        lineSeries: [windowPoints],
        summaryStatistics: updateSummaryStatistics(chartSeries),
      }
    },
    enabled: isVisible
  });

  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} />
      <Row>
        <Col lg={5}>
          <Card>
            <UnidimensionalBoxPlot
              series={data?.chartSeries || []}
              zygosity={datasetSummary.zygosity}
            />
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <UnidimensionalScatterPlot
              scatterSeries={data?.chartSeries || []}
              lineSeries={data?.lineSeries || []}
              zygosity={datasetSummary["zygosity"]}
              parameterName={datasetSummary["parameterName"]}
              unit={datasetSummary["unit"]["x"]}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Results of statistical analysis</h2>

            <Alert variant="green">
              <p className="mb-0">
                <strong>Genotype P value</strong>
              </p>
              <p>
                {formatPValue(
                  datasetSummary["statisticalMethod"]["attributes"][
                    "genotypeEffectPValue"
                  ]
                ) || "NA"}
              </p>
              <p className="mb-0">
                <strong>Genotype*Female P value</strong>
              </p>
              <p>
                {" "}
                {datasetSummary["statisticalMethod"]["attributes"][
                  "femaleKoEffectPValue"
                ]
                  ? formatPValue(
                      datasetSummary["statisticalMethod"]["attributes"][
                        "femaleKoEffectPValue"
                      ]
                    )
                  : "NA"}
              </p>
              <p className="mb-0">
                <strong>Genotype*Male P value</strong>
              </p>
              <p>
                {" "}
                {datasetSummary["statisticalMethod"]["attributes"][
                  "maleKoEffectPValue"
                ]
                  ? formatPValue(
                      datasetSummary["statisticalMethod"]["attributes"][
                        "maleKoEffectPValue"
                      ]
                    )
                  : "NA"}
              </p>
              <p className="mb-0">
                <strong>Classification</strong>
              </p>
              <p>{datasetSummary["classificationTag"]}</p>
            </Alert>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Summary statistics of all data in the dataset</h2>
            <SortableTable
              headers={[
                { width: 5, label: "", disabled: true },
                { width: 2, label: "Mean", disabled: true },
                { width: 2, label: "Stddev", disabled: true },
                { width: 3, label: "# Samples", disabled: true },
              ]}
            >
              {(data?.summaryStatistics || []).map(stats =>
                <tr>
                  <td>{stats.label}</td>
                  <td>{stats.mean}</td>
                  <td>{stats.stddev}</td>
                  <td>{stats.count}</td>
                </tr>
              )}
            </SortableTable>
          </Card>
        </Col>
        <Col lg={6}>
          <StatisticalMethodTable datasetSummary={datasetSummary} />
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Windowing parameters</h2>
            <a
              className="link"
              href="https://www.mousephenotype.org/help/data-visualization/chart-pages/"
            >
              {" "}
              View documentation about soft windowing{" "}
              <FontAwesomeIcon icon={faChevronRight} />
            </a>
            <SortableTable
              headers={[
                { width: 8, label: "Parameter", disabled: true },
                { width: 4, label: "Value", disabled: true },
              ]}
            >
              <tr>
                <td>Sharpness (k) </td>
                <td>
                  {datasetSummary["softWindowing"]["shape"]
                    ? datasetSummary["softWindowing"]["shape"].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Bandwidth (l)</td>
                <td>{datasetSummary["softWindowing"]["bandwidth"]}</td>
              </tr>
            </SortableTable>
          </Card>
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

export default Unidimensional;
