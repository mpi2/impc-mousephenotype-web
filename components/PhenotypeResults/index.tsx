import styles from "./styles.module.scss";
import { Alert, Col, Container, Row } from "react-bootstrap";
import {
  faChartColumn,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRouter } from "next/router";
import Card from "../Card";
import { useState } from "react";
import Pagination from "../Pagination";
import useQuery from "../useQuery";

const PhenotypeResult = ({
  phenotype: {
    entityProperties: { mpId, phenotypeName, synonyms },
  },
}) => {
  const router = useRouter();
  const synonymsArray = synonyms.split(";");
  return (
    <>
      <Row
        className={styles.result}
        onClick={() => {
          router.push(`/phenotypes/${mpId}`);
        }}
      >
        <Col sm={6}>
          <h4 className="mb-2 text-capitalize">{phenotypeName}</h4>
          <p className="grey mb-0">
            <small>
              <strong>Description:</strong> ???
            </small>
          </p>
          <p className="grey">
            <small>
              <strong>Synomyms:</strong> {synonymsArray.join(", ")}
            </small>
          </p>
        </Col>
        <Col sm={4}>
          {1 > 0 ? (
            <p className="small">
              <FontAwesomeIcon className="secondary" icon={faCheckCircle} />{" "}
              <strong>??</strong> genes associated with this phenotype
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

const PhenotypeResults = ({ query }: { query?: string }) => {
  const [data, setData] = useState(null);
  const [_, loading, error] = useQuery({
    query: `/api/search/v1/search?prefix=${query}&type=PHENOTYPE`,
    afterSuccess: (result) => setData(result.results),
  });
  return (
    <Container style={{ maxWidth: 1240 }}>
      <Card
        style={{
          marginTop: -80,
        }}
      >
        {query ? (
          <>
            <h1 className="mb-1">
              <strong>Phenotype Search results</strong>
            </h1>

            <p className="grey">
              <small>
                Found {data?.length || 0} entries{" "}
                {!!query && (
                  <>
                    matching <strong>"{query}"</strong>
                  </>
                )}
              </small>
            </p>
          </>
        ) : (
          <h1>
            <strong>Top 10 most searched phenotypes</strong>
          </h1>
        )}
        {loading ? (
          <p className="grey mt-3 mb-3">Loading...</p>
        ) : (
          <Pagination data={data}>
            {(pageData) => {
              if (pageData.length === 0) {
                return (
                  <Alert variant="yellow">
                    <p>No results found.</p>
                  </Alert>
                );
              }
              return (
                <>
                  {pageData.map((p) => (
                    <PhenotypeResult phenotype={p} key={p.entityId} />
                  ))}
                </>
              );
            }}
          </Pagination>
        )}
      </Card>
    </Container>
  );
};

export default PhenotypeResults;
