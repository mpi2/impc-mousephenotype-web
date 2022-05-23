import { Col, Container, Row } from "react-bootstrap";
import Card from "../../components/Card";
import Search from "../../components/Search";

const Charts = () => {
  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <h2>Mavs data charts</h2>
        </Card>
        <Card>
          <h2>Description of the experiments performed</h2>
          <Row>
            <Col md={6}>
              <p>
                A Body Composition (DEXA lean/fat) phenotypic assay was
                performed on 802 mice. The charts show the results of measuring
                Bone Mineral Density (excluding skull) in 8 female, 8 male
                mutants compared to 395 female, 391 male controls. The mutants
                are for the Mavsem1(IMPC)Mbp allele.
              </p>
              <p className="small">
                * The high throughput nature of the IMPC means that large
                control sample sizes may accumulate over a long period of time.
                See the animal welfare guidelines for more information.
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-0">
                Testing protocol: Body Composition (DEXA lean/fat)
              </p>
              <p className="mb-0">
                Testing environment: Lab conditions and equipment
              </p>
              <p className="mb-0">
                Measured value: Bone Mineral Density (excluding skull)
              </p>
              <p className="mb-0">Life stage: Early adult</p>
              <p className="mb-0">Background Strain: involves: C57BL/6NCrl</p>
              <p className="mb-0">Phenotyping center: UC Davis</p>
              <p className="mb-0">
                Associated Phenotype: decreased bone mineral density
              </p>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default Charts;
