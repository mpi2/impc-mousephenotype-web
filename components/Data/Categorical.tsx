import {
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import SortableTable from "../SortableTable";
import CategoricalBarPlot from "./Plots/CategoricalBarPlot";
import { formatPValue } from "@/utils";
import { capitalize } from "lodash";
import ChartSummary from "./ChartSummary/ChartSummary";
import { GeneralChartProps } from "@/models";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const filterChartSeries = (zygosity: string, seriesArray: Array<any>) => {
  if (zygosity === 'hemizygote') {
    return seriesArray.filter(c => c.sex === 'male');
  }
  const validExperimentalSeries = seriesArray
    .filter(c => c.sampleGroup === 'experimental' && c.value > 0);
  const validExperimentalSeriesSexes = validExperimentalSeries.map(c => c.sex);
  const controlSeries = seriesArray
    .filter(c => c.sampleGroup === 'control' && validExperimentalSeriesSexes.includes(c.sex));
  return [ ...controlSeries, ...validExperimentalSeries ];
}

const Categorical = ({ datasetSummary, isVisible }: GeneralChartProps) => {

  const { data } = useQuery({
    queryKey: ["dataset", datasetSummary.parameterName, datasetSummary.datasetId],
    queryFn: () => {
      const dataReleaseVersion = process.env.NEXT_PUBLIC_DR_DATASET_VERSION || 'latest';
      return fetch(
        `https://impc-datasets.s3.eu-west-2.amazonaws.com/${dataReleaseVersion}/${datasetSummary["datasetId"]}.json`
      ).then((res) => res.json());
    },
    select: (response) => {
      const series: Array<any> = [];
      const index = {};
      const categories = [];
      response.series.forEach((s) => {
        if (!index[s.specimenSex]) index[s.specimenSex] = {};
        if (!index[s.specimenSex][s.sampleGroup]) {
          index[s.specimenSex][s.sampleGroup] = { total: 0 };
        }
        s.observations.forEach((o) => {
          if (!index[s.specimenSex][s.sampleGroup][o.category]) {
            index[s.specimenSex][s.sampleGroup][o.category] = 0;
          }
          index[s.specimenSex][s.sampleGroup].total += 1;
          index[s.specimenSex][s.sampleGroup][o.category] += 1;
          if (!categories.includes(o.category)) categories.push(o.category);
        });
      });

      Object.keys(index).forEach((sex) =>
        Object.keys(index[sex]).forEach((sampleGroup) => {
          categories.forEach((category) => {
            const count = index[sex][sampleGroup][category] || 0;
            const total = index[sex][sampleGroup].total;
            series.push({
              sex,
              sampleGroup,
              category,
              value: (count / total) * 100,
            });
          });
        })
      );
      return {
        categories,
        series: filterChartSeries(datasetSummary.zygosity, series),
        categoryIndex: index
      }
    },
    enabled: isVisible,
    placeholderData: { series: [] }
  });

  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} />
      <Row>
        <Col lg={8}>
          <Card>
            <h2 className="primary">
              <CategoricalBarPlot
                series={data?.series}
                zygosity={datasetSummary["zygosity"]}
              />
            </h2>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <h2>Results of statistical analysis</h2>
            <Alert variant="green">
              <p className="mb-0">
                <strong>Combined Male and Female P value</strong>
              </p>
              <p>
                {" "}
                {datasetSummary["reportedPValue"]
                  ? formatPValue(datasetSummary["reportedPValue"])
                  : "NA"}
              </p>
              <p className="mb-0">
                <strong>Males only</strong>
              </p>
              <p>
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
                <strong>Females only</strong>
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
                <strong>Classification</strong>
              </p>
              <p>{datasetSummary["classificationTag"]}</p>
            </Alert>
          </Card>
        </Col>
        <Col lg={12}>
          <Card>
            <h2>Counts by sample type</h2>
            <SortableTable
              headers={[
                { width: 4, label: "Sample type / Category", disabled: true },
              ].concat(
                Object.keys(data.categoryIndex)
                  .flatMap((sex) =>
                    Object.keys(data.categoryIndex[sex]).map(
                      (c) =>
                        capitalize(sex) +
                        " " +
                        (c == "experimental" ? datasetSummary["zygosity"] : c)
                    )
                  )
                  .map((c) => {
                    return { width: 2, label: c, disabled: true };
                  })
              )}
            >
              {data.categories.map((category) => {
                return (
                  <tr>
                    <td>{category}</td>
                    {Object.keys(data.categoryIndex).flatMap((sex) =>
                      Object.keys(data.categoryIndex[sex]).map((sampleGroup) =>
                        !data.categoryIndex[sex][sampleGroup][category] ? (
                          <td>0</td>
                        ) : (
                          <td>{data.categoryIndex[sex][sampleGroup][category]}</td>
                        )
                      )
                    )}
                  </tr>
                );
              })}
            </SortableTable>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Statistical method</h2>
            <p>{datasetSummary["statisticalMethod"]["name"]}</p>
            {datasetSummary.resourceName === '3i' && (
              <>
                <span>Supplied as data</span>
                <span>
                  <Link
                    className="link primary"
                    href="https://www.immunophenotype.org/threei/#/methods/statistical-design"
                    target="_blank"
                  >
                    Statistical design
                  </Link>
                  &nbsp;
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="grey"
                    size="xs"
                  />
                </span>
              </>
            )}
            {datasetSummary.resourceName === 'pwg' && (
              <>
                <span>Supplied as data</span>
                <span>
                  <Link
                    className="link primary"
                    href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/"
                    target="_blank"
                  >
                    Pain sensitivity publication
                  </Link>
                </span>
              </>
            )}
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Access the results programmatically</h2>
            <p>
              <a
                className="link"
                target="_blank"
                href="https://www.ebi.ac.uk/mi/impc/solr/statistical-result/select?q=*:*&rows=2147483647&sort=p_value+asc&wt=xml&fq=marker_accession_id:%22MGI:1929293%22&fq=phenotyping_center:(%22MRC+Harwell%22)&fq=metadata_group:a8ee4a7178561c567069d111ea7338b8&fq=allele_accession_id:%22MGI:5548707%22&fq=pipeline_stable_id:HRWL_001&fq=parameter_stable_id:IMPC_HEM_037_001&fq=zygosity:homozygote&fq=strain_accession_id:MGI\:2164831"
              >
                Statistical result raw XML{" "}
                <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
              </a>
            </p>
            <p>
              <a
                className="link"
                target="_blank"
                href="https://www.ebi.ac.uk/mi/impc/solr/genotype-phenotype/select?q=*:*&rows=2147483647&sort=p_value+asc&wt=xml&fq=marker_accession_id:%22MGI:1929293%22&fq=phenotyping_center:(%22MRC+Harwell%22)&fq=allele_accession_id:%22MGI:5548707%22&fq=pipeline_stable_id:HRWL_001&fq=parameter_stable_id:IMPC_HEM_037_001&fq=zygosity:homozygote&fq=strain_accession_id:MGI\:2164831"
              >
                Genotype phenotype raw XML{" "}
                <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
              </a>
            </p>
            <p>
              <a
                className="link"
                target="_blank"
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

export default Categorical;
