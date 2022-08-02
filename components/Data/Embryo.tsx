import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";

const Unidimensional = () => {
  const router = useRouter();
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
            <strong>Mavs data charts [Embryo]</strong>
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
            <h2 className="primary">[Insert box plot]</h2>
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <h2 className="primary">[Insert scatter plot]</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Results of statistical analysis</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Summary statistics of all data in the dataset</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Statistical method</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Windowing parameters</h2>
          </Card>
          <Card>
            <h2>Access the results programmatically</h2>
          </Card>
        </Col>
        <Col>
          <Card>
            <h2>Download all the data</h2>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Unidimensional;
