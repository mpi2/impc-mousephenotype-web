import {
  faArrowLeftLong,
  faChevronRight,
  faDownload,
  faExternalLinkAlt,
  faInfo,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Card from "../Card";
import SortableTable from "../SortableTable";
import UnidimensionalBoxPlot from "./Plots/UnidimensionalBoxPlot";
import UnidimensionalScatterPlot from "./Plots/UnidimensionalScatterPlot";

const Unidimensional = () => {
  const router = useRouter();
  const [scatterSeries, setScatterSeries] = useState([]);
  const [lineSeries, setLineSeries] = useState([]);
  const [boxPlotSeries, setBoxPlotSeries] = useState([]);

  const getScatterSeries = (dataPoints, sex, sampleGroup) => {
    const data = dataPoints
      .filter(
        (p) => p.biologicalSampleGroup === sampleGroup && p.specimenSex === sex
      )
      .map((p) => {
        p.x = moment(p.dateOfExperiment);
        p.y = +p.dataPoint;
        return p;
      });
    return {
      sex,
      sampleGroup,
      data,
    };
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/supporting-data-unidimensional/MGI:1929293/`
      );
      if (res.ok) {
        const response = await res.json();
        console.log(response);
        const dataPoints = response.dataPoints;

        const femaleWTPoints = getScatterSeries(
          dataPoints,
          "female",
          "control"
        );
        const maleWTPoints = getScatterSeries(dataPoints, "male", "control");
        const femaleHomPoints = getScatterSeries(
          dataPoints,
          "female",
          "experimental"
        );
        const maleHomPoints = getScatterSeries(
          dataPoints,
          "male",
          "experimental"
        );
        const windowPoints = [...dataPoints].map((p) => {
          const windowP = { ...p };
          windowP.x = moment(p.dateOfExperiment);
          const weigth = p.windowWeight ? +p.windowWeight : 1;
          windowP.y = weigth;
          return windowP;
        });

        setBoxPlotSeries([
          femaleWTPoints,
          maleWTPoints,
          femaleHomPoints,
          maleHomPoints,
        ]);

        setScatterSeries([
          femaleWTPoints,
          maleWTPoints,
          femaleHomPoints,
          maleHomPoints,
        ]);
        setLineSeries([windowPoints]);
      }
    })();
  }, []);

  if (!scatterSeries) {
    return <p>Loading...</p>;
  }

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
            <strong>Mavs data charts</strong>
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
        <Col lg={5}>
          <Card>
            <UnidimensionalBoxPlot
              series={boxPlotSeries}
              zygosity="homozygote"
            />
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <UnidimensionalScatterPlot
              scatterSeries={scatterSeries}
              lineSeries={lineSeries}
              zygosity="homozygote"
              parameterName="Bone Mineral Density (excluding skull)"
              unit="sm"
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
              <p>0.604</p>
              <p className="mb-0">
                <strong>Genotype*Female P value</strong>
              </p>
              <p>0.651</p>
              <p className="mb-0">
                <strong>Genotype*Male P value</strong>
              </p>
              <p>8.59×10-05</p>
              <p className="mb-0">
                <strong>Classification</strong>
              </p>
              <p>
                With phenotype threshold value 1e-04 - Significant for males
                only
              </p>
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
              <tr>
                <td>Female Control</td>
                <td>0.05</td>
                <td>0.03</td>
                <td>205</td>
              </tr>
              <tr>
                <td>Female homozygote</td>
                <td>0.06</td>
                <td>0.02</td>
                <td>6</td>
              </tr>
              <tr>
                <td>Male Control</td>
                <td>0.06</td>
                <td>0.04</td>
                <td>251</td>
              </tr>
              <tr>
                <td>Male homozygote </td>
                <td>0.15 </td>
                <td>0.09</td>
                <td>13</td>
              </tr>
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
                <td>true</td>
              </tr>
              <tr>
                <td>Variance significant </td>
                <td>true</td>
              </tr>
              <tr>
                <td>Genotype*Sex interaction effect p value </td>
                <td>0.00590</td>
              </tr>
              <tr>
                <td>Genotype parameter estimate </td>
                <td>-0.00837</td>
              </tr>
              <tr>
                <td>Genotype standard error estimate </td>
                <td>0.0161</td>
              </tr>
              <tr>
                <td>Genotype Effect P Value </td>
                <td>0.604</td>
              </tr>
              <tr>
                <td>Sex Parameter Estimate </td>
                <td>0.00194</td>
              </tr>
              <tr>
                <td>Sex Standard Error Estimate </td>
                <td>0.00623</td>
              </tr>
              <tr>
                <td>Sex Effect P Value </td>
                <td>0.756</td>
              </tr>
              <tr>
                <td>Intercept Estimate </td>
                <td>0.0669</td>
              </tr>
              <tr>
                <td>Intercept Estimate Standard Error </td>
                <td>0.0103</td>
              </tr>
              <tr>
                <td>Sex Male KO P Value </td>
                <td>8.59×10-05</td>
              </tr>
              <tr>
                <td>Sex Female KO P Value </td>
                <td>0.651</td>
              </tr>
              <tr>
                <td>WT Residuals Normality Tests </td>
                <td>6.98×10-10</td>
              </tr>
              <tr>
                <td>KO Residuals Normality Tests </td>
                <td>0.255</td>
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
                <td>1.041</td>
              </tr>
              <tr>
                <td>Bandwidth (l)</td>
                <td>110</td>
              </tr>
            </SortableTable>
          </Card>
          <Card>
            <h2>Access the results programmatically</h2>
            <p>
              <a
                className="link"
                href="https://www.ebi.ac.uk/mi/impc/solr/statistical-result/select?q=*:*&rows=2147483647&sort=p_value+asc&wt=xml&fq=marker_accession_id:%22MGI:1929293%22&fq=phenotyping_center:(%22MRC+Harwell%22)&fq=metadata_group:a8ee4a7178561c567069d111ea7338b8&fq=allele_accession_id:%22MGI:5548707%22&fq=pipeline_stable_id:HRWL_001&fq=parameter_stable_id:IMPC_HEM_037_001&fq=zygosity:homozygote&fq=strain_accession_id:MGI\:2164831"
              >
                Statistical result raw XML{" "}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </p>
            <p>
              <a
                className="link"
                href="https://www.ebi.ac.uk/mi/impc/solr/genotype-phenotype/select?q=*:*&rows=2147483647&sort=p_value+asc&wt=xml&fq=marker_accession_id:%22MGI:1929293%22&fq=phenotyping_center:(%22MRC+Harwell%22)&fq=allele_accession_id:%22MGI:5548707%22&fq=pipeline_stable_id:HRWL_001&fq=parameter_stable_id:IMPC_HEM_037_001&fq=zygosity:homozygote&fq=strain_accession_id:MGI\:2164831"
              >
                Genotype phenotype raw XML{" "}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </p>
            <p>
              <a
                className="link"
                href="https://www.mousephenotype.org/data/exportraw?phenotyping_center=MRC%20Harwell&parameter_stable_id=IMPC_HEM_037_001&allele_accession_id=MGI:5548707&strain=MGI:2164831&pipeline_stable_id=HRWL_001&&zygosity=homozygote&"
              >
                PhenStat-ready raw experiment data{" "}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
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

export default Unidimensional;
