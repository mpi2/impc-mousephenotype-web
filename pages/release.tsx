import Search from "../components/Search";
import Card from "../components/Card";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const valuePair = (key, value) => (
  <div>
    <span className="grey">{key}: </span>
    <strong>{value}</strong>
  </div>
);

const ReleaseNote = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <Search />
      <Container style={{ maxWidth: 1240 }} className="page">
        <Card>
          <p
            className="small caps mb-2 primary"
            style={{ letterSpacing: "0.1rem" }}
          >
            RELEASE NOTES
          </p>
          <h1 className="h1 mb-2">IMPC Data Release 19.0 Notes</h1>
          <p className="grey mb-3">9th May 2023</p>

          <Row className="mb-4">
            <Col lg={6}>
              <h3 className="mb-0 mt-3 mb-2">Summary</h3>
              {valuePair("Number of phenotyped genes", "8,481")}
              {valuePair("Number of phenotyped mutant lines", "9,138")}
              {valuePair("Number of phenotype calls", "102,805")}
            </Col>
            <Col lg={6}>
              <h3 className="mb-0 mt-3 mb-2">Data access</h3>
              <div className="mb-1">
                <a href="#" className="link orange-dark ">
                  Ftp interface{" "}
                  <FontAwesomeIcon
                    icon={faExternalLink}
                    size="sm"
                    className="grey"
                  />
                </a>
              </div>
              <div>
                <a href="#" className="link orange-dark ">
                  RESTful interfaces{" "}
                  <FontAwesomeIcon
                    icon={faExternalLink}
                    size="sm"
                    className="grey"
                  />
                </a>
              </div>
            </Col>
          </Row>

          {valuePair("Statistical package", "OpenStats (1.12.0)")}
          {valuePair("Genome Assembly", "Mus musculus (GRCm38)")}

          <h3 className="mb-0 mt-5 mb-2">Highlights</h3>
          <p>Includes approximately 2.1 million more data points.</p>
        </Card>
        <Card>
          <h2>Total number of lines and specimens in DR 19.0</h2>
          <p className="grey">Insert table</p>
        </Card>
        <Card>
          <h2>Experimental data and quality checks</h2>
          <p className="grey">Insert table</p>
        </Card>
        <Card>
          <h2>Distribution of phenotype annotations</h2>
          <p className="grey">Insert Chart</p>
        </Card>
        <Card>
          <h2>Production status</h2>
          <h3>Overall</h3>
          <Row className="mb-4">
            <Col lg={6}>
              <p className="grey">Insert Chart</p>
            </Col>
            <Col lg={6}>
              <p className="grey">Insert Chart</p>
            </Col>
          </Row>
          <h3>By center</h3>
          <Row className="mb-4">
            <Col lg={6}>
              <p className="grey">Insert Chart</p>
            </Col>
            <Col lg={6}>
              <p className="grey">Insert Chart</p>
            </Col>
          </Row>
          <p>
            More charts and status information are available from our mouse
            tracking service <a className="link orange-dark">GenTaR</a>.
          </p>
        </Card>
        <Card>
          <h2>Phenotype associations</h2>
          <p className="grey">Insert Chart</p>
        </Card>
        <Card>
          <h2>Trends</h2>
          <p className="grey">Insert Chart</p>
          <p className="grey">Insert Chart</p>
        </Card>

        <Card>
          <h2>Previous releases</h2>
          <ul>
            <li>
              <a href="/data/previous-releases/18.0">Release 18.0 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/17.0">Release 17.0 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/16.0">Release 16.0 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/15.1">Release 15.1 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/15.0">Release 15.0 notes</a>
            </li>

            {!showAll ? (
              <Button
                variant="outline-secondary"
                className="mt-2"
                onClick={() => {
                  setShowAll(true);
                }}
              >
                Show all releases
              </Button>
            ) : (
              <>
                <li>
                  <a href="/data/previous-releases/14.0">Release 14.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/13.0">Release 13.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/12.0">Release 12.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/11.0">Release 11.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/10.1">Release 10.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/10.0">Release 10.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/9.2">Release 9.2 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/9.1">Release 9.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/8.0">Release 8.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/7.0">Release 7.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/6.1">Release 6.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/6.0">Release 6.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/5.0">Release 5.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/4.3">Release 4.3 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/4.2">Release 4.2 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/4.0">Release 4.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.4">Release 3.4 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.3">Release 3.3 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.2">Release 3.2 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.1">Release 3.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.0">Release 3.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/2.0">Release 2.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/1.1">Release 1.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/1.0">Release 1.0 notes</a>
                </li>
              </>
            )}
          </ul>
        </Card>
      </Container>
    </>
  );
};

export default ReleaseNote;
