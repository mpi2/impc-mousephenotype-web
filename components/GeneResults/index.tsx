import styles from "./styles.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import {
  faChartColumn,
  faCheckCircle,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";
import { useRouter } from "next/router";
import Card from "../Card";

const GeneResult = ({ progress = true }: { progress?: boolean }) => {
  const router = useRouter();
  return (
    <>
      <Row
        className={styles.result}
        onClick={() => {
          router.push("/gene/12345");
        }}
      >
        <Col sm={4}>
          <h2 className="mb-2">Mavs</h2>
          <p className="grey mb-0">
            <small>
              <strong>Name:</strong> mitochondrial antiviral signaling protein
            </small>
          </p>
          <p className="grey">
            <small>
              <strong>Synomyms:</strong> IPS-1, D430028G21Rik
            </small>
          </p>
        </Col>
        <Col sm={5}>
          <p>
            {progress ? (
              <small>
                <FontAwesomeIcon className="secondary" icon={faCheckCircle} />{" "}
                ES Cells produced<span className="me-4"></span>
                <FontAwesomeIcon
                  className="secondary"
                  icon={faCheckCircle}
                />{" "}
                Mice produced<span className="me-4"></span>
                <FontAwesomeIcon
                  className="secondary"
                  icon={faCheckCircle}
                />{" "}
                Phenotyping data
              </small>
            ) : (
              <small className="grey">
                <FontAwesomeIcon icon={faTimes} /> Production and phenotyping
                currently not planned.
              </small>
            )}
          </p>
        </Col>
        <Col sm={3} className="text-right">
          <span className="primary">
            <FontAwesomeIcon icon={faChartColumn} /> View data
          </span>{" "}
          {progress && (
            <span onClick={(e) => e.stopPropagation()} className="ms-4">
              <Link href="/">
                <a href="#" className="primary">
                  <FontAwesomeIcon icon={faShoppingCart} /> Order mice
                </a>
              </Link>
            </span>
          )}
        </Col>
      </Row>
      <hr className="mt-0 mb-0" />
    </>
  );
};

const GeneResults = () => {
  return (
    <Container>
      <Card
        style={{
          marginTop: -80,
        }}
      >
        <h1 className="mb-1">
          <strong>Gene Search results</strong>
        </h1>
        <p className="grey">
          <small>Showing 1 to 10 of 22947 entries</small>
        </p>
        <GeneResult />
        <GeneResult />
        <GeneResult />
        <GeneResult />
        <GeneResult />
        <GeneResult />
        <GeneResult />
        <GeneResult />
        <GeneResult progress={false} />
        <GeneResult progress={false} />
      </Card>
    </Container>
  );
};

export default GeneResults;
