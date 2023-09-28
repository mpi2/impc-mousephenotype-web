import {
  faArrowLeftLong,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Alert, Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import SortableTable from "../SortableTable";
import { formatAlleleSymbol } from "../../utils";
import PieChart from "../PieChart";
import styles from "./styles.module.scss";

const Viability = ({ datasetSummary }) => {
  const router = useRouter();
  const allele = formatAlleleSymbol(datasetSummary["alleleSymbol"]);
  const datasetViaOne = {
    datasetId: "1946b8fe32ac796315a5b0680985eaaa",
    series: [
      {
        parameterStableId: "IMPC_VIA_005_001",
        parameterName: "Total pups heterozygous",
        dataPoint: 22.0,
      },
      {
        parameterStableId: "IMPC_VIA_009_001",
        parameterName: "Total male homozygous",
        dataPoint: 0.0,
      },
      {
        parameterStableId: "IMPC_VIA_008_001",
        parameterName: "Total male heterozygous",
        dataPoint: 10.0,
      },
      {
        parameterStableId: "IMPC_VIA_006_001",
        parameterName: "Total pups homozygous",
        dataPoint: 0.0,
      },
      {
        parameterStableId: "IMPC_VIA_010_001",
        parameterName: "Total male pups",
        dataPoint: 15.0,
      },
      {
        parameterStableId: "IMPC_VIA_012_001",
        parameterName: "Total female heterozygous",
        dataPoint: 12.0,
      },
      {
        parameterStableId: "IMPC_VIA_007_001",
        parameterName: "Total male WT",
        dataPoint: 5.0,
      },
      {
        parameterStableId: "IMPC_VIA_004_001",
        parameterName: "Total pups WT",
        dataPoint: 6.0,
      },
      {
        parameterStableId: "IMPC_VIA_011_001",
        parameterName: "Total female WT",
        dataPoint: 1.0,
      },
      {
        parameterStableId: "IMPC_VIA_013_001",
        parameterName: "Total female homozygous",
        dataPoint: 0.0,
      },
      {
        parameterStableId: "IMPC_VIA_014_001",
        parameterName: "Total female pups",
        dataPoint: 13.0,
      },
      {
        parameterStableId: "IMPC_VIA_003_001",
        parameterName: "Total pups",
        dataPoint: 28.0,
      },
    ],
  };

  const datasetViaTwo = {
    datasetId: "0ce669b4774e3391fdad46f68941d392",
    series: [
      {
        parameterStableId: "IMPC_VIA_057_001",
        parameterName: "Total pups",
        dataPoint: 166.0,
      },
      {
        parameterStableId: "IMPC_VIA_062_001",
        parameterName: "Total females",
        dataPoint: 77.0,
      },
      {
        parameterStableId: "IMPC_VIA_051_001",
        parameterName: "Total heterozygous males",
        dataPoint: 51.0,
      },
      {
        parameterStableId: "IMPC_VIA_056_001",
        parameterName: "Total anzygous females",
        dataPoint: 0.0,
      },
      {
        parameterStableId: "IMPC_VIA_060_001",
        parameterName: "Total homozygotes",
        dataPoint: 23.0,
      },
      {
        parameterStableId: "IMPC_VIA_055_001",
        parameterName: "Total of hemizygous males",
        dataPoint: 0.0,
      },
      {
        parameterStableId: "IMPC_VIA_059_001",
        parameterName: "Total heterozygotes",
        dataPoint: 94.0,
      },
      {
        parameterStableId: "IMPC_VIA_050_001",
        parameterName: "Total WT females",
        dataPoint: 20.0,
      },
      {
        parameterStableId: "IMPC_VIA_052_001",
        parameterName: "Total heterozygous females",
        dataPoint: 43.0,
      },
      {
        parameterStableId: "IMPC_VIA_054_001",
        parameterName: "Total homozygous females",
        dataPoint: 14.0,
      },
      {
        parameterStableId: "IMPC_VIA_058_001",
        parameterName: "Total WTs",
        dataPoint: 49.0,
      },
      {
        parameterStableId: "IMPC_VIA_049_001",
        parameterName: "Total WT males",
        dataPoint: 29.0,
      },
      {
        parameterStableId: "IMPC_VIA_061_001",
        parameterName: "Total males",
        dataPoint: 89.0,
      },
      {
        parameterStableId: "IMPC_VIA_053_001",
        parameterName: "Total homozygous males",
        dataPoint: 9.0,
      },
    ],
  };

  const viabilityOneParametersMap = {
    both: {
      homozygote: "IMPC_VIA_006_001",
      heterozygote: "IMPC_VIA_005_001",
      wildtype: "IMPC_VIA_004_001",
      na: "IMPC_VIA_003_001",
    },
    male: {
      homozygote: "IMPC_VIA_009_001",
      heterozygote: "IMPC_VIA_008_001",
      wildtype: "IMPC_VIA_007_001",
      na: "IMPC_VIA_010_001",
    },
    female: {
      homozygote: "IMPC_VIA_013_001",
      heterozygote: "IMPC_VIA_012_001",
      wildtype: "IMPC_VIA_011_001",
      na: "IMPC_VIA_014_001",
    },
  };

  const viabilityTwoParametersMap = {
    both: {
      homozygote: "IMPC_VIA_060_001",
      heterozygote: "IMPC_VIA_059_001",
      wildtype: "IMPC_VIA_058_001",
      na: "IMPC_VIA_057_001",
    },
    male: {
      homozygote: "IMPC_VIA_053_001",
      heterozygote: "IMPC_VIA_052_001",
      wildtype: "IMPC_VIA_049_001",
      hemizygote: "IMPC_VIA_055_001",
      na: "IMPC_VIA_061_001",
    },
    female: {
      homozygote: "IMPC_VIA_054_001",
      heterozygote: "IMPC_VIA_052_001",
      wildtype: "IMPC_VIA_050_001",
      anzygote: "IMPC_VIA_056_001",
      na: "IMPC_VIA_062_001",
    },
  };

  const viabilityParameterMap =
    datasetSummary.procedureStableId === "IMPC_VIA_002"
      ? viabilityTwoParametersMap
      : viabilityOneParametersMap;

  const datasetVia =
    datasetSummary.procedureStableId === "IMPC_VIA_002"
      ? datasetViaTwo
      : datasetViaOne;
  console.log(datasetSummary);
  console.log(datasetVia);
  console.log(viabilityParameterMap);

  const totalCountData = [
    {
      label: "Total WTs",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.both.wildtype
      ).dataPoint,
    },
    {
      label: "Total Homozygotes",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.both.homozygote
      ).dataPoint,
    },
    {
      label: "Total Heterozygotes",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.both.heterozygote
      ).dataPoint,
    },
  ].filter((d) => d.value != 0);

  const maleCountData = [
    {
      label: "Total Male WT",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.male.wildtype
      ).dataPoint,
    },
    {
      label: "Total Male Heterozygous",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.male.heterozygote
      ).dataPoint,
    },
    {
      label: "Total Male Homozygous",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.male.homozygote
      ).dataPoint,
    },
  ].filter((d) => d.value != 0);

  const femaleCountData = [
    {
      label: "Total Female WT",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.female.wildtype
      ).dataPoint,
    },
    {
      label: "Total Female Heterozygous",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.female.heterozygote
      ).dataPoint,
    },
    {
      label: "Total Female Homozygous",
      value: datasetVia.series.find(
        (d) => d.parameterStableId == viabilityParameterMap.female.homozygote
      ).dataPoint,
    },
  ].filter((d) => d.value != 0);

  return (
    <>
      <Card>
        <div>
          <button
            style={{ border: 0, background: "none", padding: 0 }}
            onClick={() => {
              router.back();
            }}
          >
            <a href="#" className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} /> GO BACK
            </a>
          </button>
          <h1>
            <strong>
              {datasetSummary["geneSymbol"]} {datasetSummary["parameterName"]}{" "}
              data
            </strong>
          </h1>
          <Alert variant="yellow">
            <p>Please note:</p>
            <ul>
              <li>
                data for different colonies will be presented separately (e.g.
                different alleles; same allele but different background strain;
                same allele but in different phenotyping centers)
              </li>
              <li>
                phenotype calls are made when a statistically significant
                abnormal phenotype is detected (that is, preweaning lethality or
                absence of expected number of homozygote pups based on Mendelian
                ratios)
              </li>
            </ul>
          </Alert>
        </div>
        <h2>Description of the experiments performed</h2>
        <Row>
          <Col md={7} style={{ borderRight: "1px solid #ddd" }}>
            <p>
              A {datasetSummary["procedureName"]} phenotypic assay was performed
              on a mutant strain carrying the {allele[0]}
              <sup>{allele[1]}</sup> allele. The charts below show the
              proportion of wild type, heterozygous, and homozygous offspring.
            </p>
          </Col>
          <Col md={5} className="small">
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing protocol
              </span>
              <strong>{datasetSummary["procedureName"]}</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing environment
              </span>
              <strong>Lab conditions and equipment</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Measured value
              </span>
              <strong>{datasetSummary["parameterName"]}</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Life stage
              </span>
              <strong>{datasetSummary["lifeStageName"]}</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Background Strain
              </span>
              <strong>{datasetSummary["geneticBackground"]}</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Phenotyping center
              </span>
              <strong>{datasetSummary["phenotypingCentre"]}</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Associated Phenotype
              </span>
              <strong>{datasetSummary["significantPhenotype"]["name"]}</strong>
            </p>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col lg={4}>
          <Card>
            <h2 className="primary">Total counts (male and female)</h2>
            <div className={styles.chartWrapper}>
              <PieChart
                data={totalCountData}
                chartColors={[
                  "rgba(239,123,10, 0.5)",
                  "rgba(31,144,185, 0.5)",
                  "rgba(119,119,119, 0.5)",
                ]}
              />
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <h2 className="primary">Male counts</h2>
            <div className={styles.chartWrapper}>
              <PieChart
                data={maleCountData}
                chartColors={[
                  "rgba(239,123,10, 0.5)",
                  "rgba(31,144,185, 0.5)",
                  "rgba(119,119,119, 0.5)",
                ]}
              />
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <h2 className="primary">Female counts</h2>
            <div className={styles.chartWrapper}>
              <PieChart
                data={femaleCountData}
                chartColors={[
                  "rgba(239,123,10, 0.5)",
                  "rgba(31,144,185, 0.5)",
                  "rgba(119,119,119, 0.5)",
                ]}
              />
            </div>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <SortableTable
              headers={[
                { width: 6, label: "Sex", disabled: true },
                { width: 1, label: "WT", disabled: true },
                { width: 1, label: "Het", disabled: true },
                { width: 1, label: "Hom", disabled: true },
                { width: 1, label: "Hemi", disabled: true },
                { width: 1, label: "Total", disabled: true },
              ]}
            >
              <tr>
                <td>Male and female</td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.both.wildtype
                    ).dataPoint
                  }
                </td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.both.heterozygote
                    ).dataPoint
                  }
                </td>
                <td>
                  {" "}
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.both.homozygote
                    ).dataPoint
                  }
                </td>
                <td></td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId == viabilityParameterMap.both.na
                    ).dataPoint
                  }
                </td>
              </tr>
              <tr>
                <td>Male</td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.male.wildtype
                    ).dataPoint
                  }
                </td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.male.heterozygote
                    ).dataPoint
                  }
                </td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.male.homozygote
                    ).dataPoint
                  }
                </td>
                <td></td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId == viabilityParameterMap.male.na
                    ).dataPoint
                  }
                </td>
              </tr>
              <tr>
                <td>Female</td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.female.wildtype
                    ).dataPoint
                  }
                </td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.female.heterozygote
                    ).dataPoint
                  }
                </td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId ==
                        viabilityParameterMap.female.homozygote
                    ).dataPoint
                  }
                </td>
                <td>N/A</td>
                <td>
                  {
                    datasetVia.series.find(
                      (d) =>
                        d.parameterStableId == viabilityParameterMap.female.na
                    ).dataPoint
                  }
                </td>
              </tr>
            </SortableTable>
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
      </Row>
    </>
  );
};

export default Viability;
