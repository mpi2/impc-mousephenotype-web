import styles from "./styles.module.scss";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import {
  faChartColumn,
  faCheck,
  faCheckCircle,
  faPlusCircle,
  faShoppingCart,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";
import { useRouter } from "next/router";
import Card from "../Card";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { GeneComparatorTrigger, useGeneComparator } from "../GeneComparator";
import useQuery from "../useQuery";

const GeneResult = ({
  gene: {
    entityProperties: {
      geneSymbol,
      geneName,
      synonyms = "",
      mgiGeneAccessionId,
      esCellProductionStatus,
      mouseProductionStatus,
      phenotypeStatus,
      phenotypingDataAvailable,
    },
  },
}: {
  gene: any;
}) => {
  const router = useRouter();
  const { addGene, genes } = useGeneComparator();
  const IsInCompare = genes.includes(mgiGeneAccessionId);
  const synonymsArray = synonyms.split(";");
  return (
    <>
      <Row
        className={styles.result}
        onClick={() => {
          router.push(`/genes/${mgiGeneAccessionId}`);
        }}
      >
        <Col sm={5}>
          <p className="secondary">
            {IsInCompare ? (
              <span>
                <FontAwesomeIcon icon={faCheck} className="secondary" />{" "}
              </span>
            ) : (
              <Button
                variant="secondary"
                className={styles.addToCompareBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  addGene(mgiGeneAccessionId);
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Compare
              </Button>
            )}
            {geneSymbol}
          </p>
          <h4 className="mb-2 text-capitalize">{geneName}</h4>
          {!!synonymsArray && synonymsArray.length && (
            <p className="grey text-capitalize small">
              <strong>Synonyms:</strong>{" "}
              {(synonymsArray || []).slice(0, 10).join(", ") || "None"}
            </p>
          )}
        </Col>
        <Col sm={4}>
          <p>
            {phenotypingDataAvailable ? (
              <span>
                <FontAwesomeIcon
                  className={!!phenotypeStatus ? "secondary" : "grey"}
                  icon={!!phenotypeStatus ? faCheckCircle : faTimesCircle}
                />{" "}
                <span className="me-4">Phenotyping data</span>
                <FontAwesomeIcon
                  className={!!esCellProductionStatus ? "secondary" : "grey"}
                  icon={
                    !!esCellProductionStatus ? faCheckCircle : faTimesCircle
                  }
                />{" "}
                <span className="me-4">ES Cells</span>
                <FontAwesomeIcon
                  className={!!mouseProductionStatus ? "secondary" : "grey"}
                  icon={!!mouseProductionStatus ? faCheckCircle : faTimesCircle}
                />{" "}
                <span className="me-4">Mice</span>
              </span>
            ) : (
              <span className="grey">
                <FontAwesomeIcon className="grey" icon={faTimesCircle} />{" "}
                Phenotyping data not yet available
              </span>
            )}
          </p>
        </Col>
        <Col sm={3} className="text-right">
          <span className="primary">
            <FontAwesomeIcon icon={faChartColumn} /> View data
          </span>{" "}
          <span onClick={(e) => e.stopPropagation()} className="ms-4">
            <Link
              href={`/genes/${mgiGeneAccessionId}/#purchase`}
              scroll={false}
            >
              <a href="#" className="primary">
                <FontAwesomeIcon icon={faShoppingCart} /> Order mice
              </a>
            </Link>
          </span>
        </Col>
      </Row>
      <hr className="mt-0 mb-0" />
    </>
  );
};

const GeneResults = ({ query }: { query?: string }) => {
  const [data, setData] = useState(null);
  const [_, loading, error] = useQuery({
    query: `/api/search/v1/search/?prefix=${query}`,
    afterSuccess: (result) => setData(result.results),
  });

  return (
    <>
      <GeneComparatorTrigger />
      <Container>
        <Card
          style={{
            marginTop: -80,
          }}
        >
          {query ? (
            <>
              <h1 className="mb-1">
                <strong>Gene Search results</strong>
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
              <strong>Top 10 most searched genes</strong>
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
                      <GeneResult gene={p} key={p.entityId} />
                    ))}
                  </>
                );
              }}
            </Pagination>
          )}
        </Card>
      </Container>
    </>
  );
};

export default GeneResults;
