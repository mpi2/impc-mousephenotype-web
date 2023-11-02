import {
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import ChartSummary from "./ChartSummary";

const TimeSeries = ({ datasetSummary }) => {
  return (
    <>
      <ChartSummary datasetSummary={datasetSummary}>
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
      </ChartSummary>
      <Row>
        <Col lg={12}>
          <Card>
            <h2 className="primary">[Insert time series]</h2>\
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

export default TimeSeries;
