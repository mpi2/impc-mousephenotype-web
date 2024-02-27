import {
  faChevronRight,
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useState, useEffect } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Card from "../Card";
import SortableTable from "../SortableTable";
import UnidimensionalBoxPlot from "./Plots/UnidimensionalBoxPlot";
import UnidimensionalScatterPlot from "./Plots/UnidimensionalScatterPlot";
import { formatPValue } from "@/utils";
import ChartSummary from "./ChartSummary";
import { Dataset } from "@/models";
import { _capitalize } from "chart.js/helpers";
import _ from "lodash";

type ChartSeries = {
  data: Array<any>,
  sampleGroup: 'control' | 'experimental',
  sex: 'male' | 'female',
}

type SummaryStatistics = {
  label: string;
  mean: number;
  stddev: number;
  count: number;
};

type Props = {
  datasetSummary: Dataset
}
const Unidimensional = ({ datasetSummary }: Props) => {
  const [scatterSeries, setScatterSeries] = useState([]);
  const [lineSeries, setLineSeries] = useState([]);
  const [boxPlotSeries, setBoxPlotSeries] = useState([]);
  const [summaryStatistics, setSummaryStatistics] = useState<Array<SummaryStatistics>>([]);

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
    const rows: Array<SummaryStatistics> = chartSeries.map(serie => {
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
    setSummaryStatistics(rows);
  }

  useEffect(() => {
    (async () => {
      const dataReleaseVersion = process.env.NEXT_PUBLIC_DR_DATASET_VERSION || 'latest';
      const res = await fetch(
        `https://impc-datasets.s3.eu-west-2.amazonaws.com/${dataReleaseVersion}/${datasetSummary["datasetId"]}.json`
      );
      if (res.ok) {
        const response = await res.json();
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
        updateSummaryStatistics(chartSeries)
        setBoxPlotSeries(chartSeries);
        setScatterSeries(chartSeries);
        setLineSeries([windowPoints]);
      }
    })();
  }, []);

  if (!scatterSeries) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} />
      <Row>
        <Col lg={5}>
          <Card>
            <UnidimensionalBoxPlot
              series={boxPlotSeries}
              zygosity={datasetSummary.zygosity}
            />
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <UnidimensionalScatterPlot
              scatterSeries={scatterSeries}
              lineSeries={lineSeries}
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
              {summaryStatistics.map(stats =>
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
          <Card>
            <h2>Statistical method</h2>
            <SortableTable
              headers={[
                { width: 8, label: "Model attribute", disabled: true },
                { width: 4, label: "Value", disabled: true },
              ]}
            >
              <tr>
                <td>Batch effect significant </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "batchSignificant"
                  ]
                    ? "true"
                    : "false"}
                </td>
              </tr>
              <tr>
                <td>Variance significant </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "varianceSignificant"
                  ]
                    ? "true"
                    : "false"}
                </td>
              </tr>
              <tr>
                <td>Genotype*Sex interaction effect p value </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "sexEffectPValue"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "sexEffectPValue"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Genotype parameter estimate </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "sexEffectParameterEstimate"
                  ]
                    ? datasetSummary["statisticalMethod"]["attributes"][
                        "sexEffectParameterEstimate"
                      ].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Genotype standard error estimate </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "genotypeEffectStderrEstimate"
                  ]
                    ? datasetSummary["statisticalMethod"]["attributes"][
                        "genotypeEffectStderrEstimate"
                      ].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Genotype Effect P Value </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "genotypeEffectPValue"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "genotypeEffectPValue"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Sex Parameter Estimate </td>
                <td>
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "sexEffectParameterEstimate"
                  ]
                    ? datasetSummary["statisticalMethod"]["attributes"][
                        "sexEffectParameterEstimate"
                      ].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Sex Standard Error Estimate </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "sexEffectStderrEstimate"
                  ]
                    ? datasetSummary["statisticalMethod"]["attributes"][
                        "sexEffectStderrEstimate"
                      ].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Sex Effect P Value </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "sexEffectPValue"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "sexEffectPValue"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Intercept Estimate </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "interceptEstimate"
                  ]
                    ? datasetSummary["statisticalMethod"]["attributes"][
                        "interceptEstimate"
                      ].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Intercept Estimate Standard Error </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "interceptEstimateStderrEstimate"
                  ]
                    ? datasetSummary["statisticalMethod"]["attributes"][
                        "interceptEstimateStderrEstimate"
                      ].toFixed(3)
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Sex Male KO P Value </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "maleKoEffectPValue"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "maleKoEffectPValue"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Sex Female KO P Value </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "femaleKoEffectPValue"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "femaleKoEffectPValue"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>WT Residuals Normality Tests </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "group1ResidualsNormalityTest"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "group1ResidualsNormalityTest"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>KO Residuals Normality Tests </td>
                <td>
                  {" "}
                  {datasetSummary["statisticalMethod"]["attributes"][
                    "group2ResidualsNormalityTest"
                  ]
                    ? formatPValue(
                        datasetSummary["statisticalMethod"]["attributes"][
                          "group2ResidualsNormalityTest"
                        ]
                      )
                    : "N/A"}
                </td>
              </tr>
            </SortableTable>
          </Card>
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
