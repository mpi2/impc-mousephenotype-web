import {
  faArrowLeftLong,
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import SortableTable from "../SortableTable";
import CategoricalBarPlot from "./Plots/CategoricalBarPlot";

const Categorical = () => {
  const router = useRouter();
  const [categoricalSeries, setCategoricalSeries] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/v1/supporting-data-categorical/MGI:1929293/`
      );
      if (res.ok) {
        const response = await res.json();
        console.log(response);
        const dataPoints: Array<any> = response.dataPoints;
        const index = {};
        const categories = [];
        dataPoints.forEach((p) => {
          if (!index[p.specimenSex]) index[p.specimenSex] = {};
          if (!index[p.specimenSex][p.biologicalSampleGroup]) {
            index[p.specimenSex][p.biologicalSampleGroup] = { total: 0 };
          }
          if (!index[p.specimenSex][p.biologicalSampleGroup][p.category]) {
            index[p.specimenSex][p.biologicalSampleGroup][p.category] = 0;
          }
          index[p.specimenSex][p.biologicalSampleGroup].total += 1;
          index[p.specimenSex][p.biologicalSampleGroup][p.category] += 1;
          if (!categories.includes(p.category)) categories.push(p.category);
        });
        console.log(index);

        const series = [];
        Object.keys(index).forEach((sex) =>
          Object.keys(index[sex]).forEach((sampleGroup) => {
            categories.forEach((category) => {
              series.push({
                sex,
                sampleGroup,
                category,
                value:
                  ((index[sex][sampleGroup][category] || 0) /
                    index[sex][sampleGroup].total) *
                  100,
              });
            });
          })
        );
        console.log(series);

        setCategoricalSeries(series);
      }
    })();
  }, []);

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
            <strong>Mavs data charts [Categorical]</strong>
          </h1>
        </div>
        <h2>Description of the experiments performed</h2>
        <Row>
          <Col md={7} style={{ borderRight: "1px solid #ddd" }}>
            <p>
              A Body Composition (DEXA lean/fat) phenotypic assay was performed
              on 802 mice. The charts show the results of measuring Bone Mineral
              Density (excluding skull) in 8 female, 8 male mutants compared to
              395 female, 391 male controls. The mutants are for the
              Mavsem1(IMPC)Mbp allele.
            </p>
            <p className="small">
              * The high throughput nature of the IMPC means that large control
              sample sizes may accumulate over a long period of time. See the
              animal welfare guidelines for more information.
            </p>
          </Col>
          <Col md={5} className="small">
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing protocol
              </span>
              <strong>Body Composition (DEXA lean/fat)</strong>
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
              <strong>Bone Mineral Density (excluding skull)</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Life stage
              </span>
              <strong>Early adult</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Background Strain
              </span>
              <strong>involves C57BL/6NCrl</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Phenotyping center
              </span>
              <strong>UC Davis</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Associated Phenotype
              </span>
              <strong>decreased bone mineral density</strong>
            </p>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col lg={12}>
          <Card>
            <h2 className="primary">
              <CategoricalBarPlot
                series={categoricalSeries}
                zygosity="homozygote"
              />
            </h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Results of statistical analysis</h2>
            <Alert variant="green">
              <p className="mb-0">
                <strong>Combined Male and Female P value</strong>
              </p>
              <p>5.76×10-36</p>
              <p className="mb-0">
                <strong>Males only</strong>
              </p>
              <p>7.57×10-21</p>
              <p className="mb-0">
                <strong>Females only</strong>
              </p>
              <p>4.60×10-16</p>
              <p className="mb-0">
                <strong>Classification</strong>
              </p>
              <p>
                With phenotype threshold value 1e-04 - significant in males,
                females and in combined dataset
              </p>
            </Alert>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Counts by sample type</h2>
            <SortableTable
              headers={[
                { width: 5, label: "Sample type", disabled: true },
                { width: 2, label: "Present", disabled: true },
                { width: 2, label: "No data", disabled: true },
                { width: 3, label: "None", disabled: true },
              ]}
            >
              <tr>
                <td>Female Control</td>
                <td>2733 </td>
                <td>1</td>
                <td>20</td>
              </tr>
              <tr>
                <td>Female homozygote</td>
                <td>1</td>
                <td>0</td>
                <td>8</td>
              </tr>
              <tr>
                <td>Male Control</td>
                <td>2756</td>
                <td>1</td>
                <td>21</td>
              </tr>
              <tr>
                <td>Male homozygote </td>
                <td>2</td>
                <td>0</td>
                <td>11</td>
              </tr>
            </SortableTable>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Statistical method</h2>
            <p>Fisher Exact Test framework</p>
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
              <FontAwesomeIcon icon={faInfoCircle} /> NOTE: Data from all charts
              will be aggregated into one download file.
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Categorical;
