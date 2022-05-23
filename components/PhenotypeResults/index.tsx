import styles from "./styles.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import {
  faChartColumn,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRouter } from "next/router";
import Card from "../Card";

const PhenotypeResult = ({ results = 0 }: { results?: number }) => {
  const router = useRouter();
  return (
    <>
      <Row
        className={styles.result}
        onClick={() => {
          router.push("/phenotypes/12345");
        }}
      >
        <Col sm={6}>
          <h2 className="mb-2">Abnormal stationary movement</h2>
          <p className="grey mb-0">
            <small>
              <strong>Definition:</strong> altered ability or inability to
              change body posture or shift a body part
            </small>
          </p>
          <p className="grey">
            <small>
              <strong>Synomyms:</strong> movement abnormalities, abnormal
              movement
            </small>
          </p>
        </Col>
        <Col sm={4}>
          {results > 0 ? (
            <p className="small">
              <FontAwesomeIcon className="secondary" icon={faCheckCircle} />{" "}
              <strong>{results}</strong> genes associated with this phenotype
            </p>
          ) : (
            <p className="grey small">
              No IMPC genes currently associated with this phenotype
            </p>
          )}
        </Col>
        <Col sm={2} className="text-right">
          <span className="primary">
            <FontAwesomeIcon icon={faChartColumn} /> View data
          </span>
        </Col>
      </Row>
      <hr className="mt-0 mb-0" />
    </>
  );
};

const PhenotypeResults = () => {
  return (
    <Container>
      <Card
        style={{
          marginTop: -80,
        }}
      >
        <h1 className="mb-1">
          <strong>Phenotype Search results</strong>
        </h1>
        <p className="grey">
          <small>Showing 1 to 10 of 22947 entries</small>
        </p>
        <PhenotypeResult results={42} />
        <PhenotypeResult results={25} />
        <PhenotypeResult />
        <PhenotypeResult />
        <PhenotypeResult results={14} />
        <PhenotypeResult />
        <PhenotypeResult />
        <PhenotypeResult />
        <PhenotypeResult />
        <PhenotypeResult />
      </Card>
    </Container>
  );
};

export default PhenotypeResults;
