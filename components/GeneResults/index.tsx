import styles from "./styles.module.scss";
import { Alert, Col, Container, Row } from "react-bootstrap";
import {
  faCheck,
  faCheckCircle,
  faPlusCircle,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";
import { useRouter } from "next/router";
import Card from "../Card";
import { useState } from "react";
import Pagination from "../Pagination";
import { GeneComparatorTrigger, useGeneComparator } from "../GeneComparator";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";

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
      <Row className={styles.row}>
        <Col
          sm={8}
          className={styles.result}
          onClick={() => {
            router.push(`/genes/${mgiGeneAccessionId}`);
          }}
        >
          <h4 className="mb-2 text-capitalize">
            <span className="blue-dark">{geneSymbol}</span>{" "}
            <span className="grey">|</span> {geneName}
          </h4>
          {!!synonymsArray && synonymsArray.length && (
            <p className="grey text-capitalize small">
              <strong>Synonyms:</strong>{" "}
              {(synonymsArray || []).slice(0, 10).join(", ") || "None"}
            </p>
          )}

          <span className="small grey">
            {phenotypingDataAvailable ? (
              <p>
                <FontAwesomeIcon
                  className={!!phenotypeStatus ? "secondary" : "grey"}
                  icon={!!phenotypeStatus ? faCheck : faTimes}
                />{" "}
                <span className={`me-4 ${!phenotypeStatus ? "grey" : ""}`}>
                  {phenotypeStatus || "No phenotyping data"}
                </span>
                <FontAwesomeIcon
                  className={!!esCellProductionStatus ? "secondary" : "gret"}
                  icon={!!esCellProductionStatus ? faCheck : faTimes}
                />{" "}
                <span
                  className={`me-4 ${!esCellProductionStatus ? "grey" : ""}`}
                >
                  {esCellProductionStatus || "No ES cells"}
                </span>
                <FontAwesomeIcon
                  className={!!mouseProductionStatus ? "secondary" : "gret"}
                  icon={!!mouseProductionStatus ? faCheck : faTimes}
                />{" "}
                <span
                  className={`me-4 ${!mouseProductionStatus ? "grey" : ""}`}
                >
                  {mouseProductionStatus || "No mice"}
                </span>
              </p>
            ) : (
              <span className="grey">
                <FontAwesomeIcon className="grey" icon={faTimes} /> Phenotyping
                data not yet available
              </span>
            )}
          </span>
        </Col>
        <Col sm={4} className={styles.shortcuts}>
          <h5 className="grey text-uppercase">
            <small>Shortcuts</small>
          </h5>
          <div
            className={`grey mb-1 ${
              IsInCompare ? styles.addedToComparison : "link"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              addGene(mgiGeneAccessionId);
            }}
          >
            <FontAwesomeIcon
              className={IsInCompare ? "secondary" : ""}
              icon={IsInCompare ? faCheckCircle : faPlusCircle}
            />{" "}
            Add
            {IsInCompare ? "ed " : " "}
            to comparison
          </div>
          <p className="grey">
            <Link
              href={`/genes/${mgiGeneAccessionId}/#purchase`}
              scroll={false}
              className="link"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              Order mice
            </Link>
          </p>
        </Col>
      </Row>
      <hr className="mt-0 mb-0" />
    </>
  );
};

const GeneResults = ({ query }: { query?: string }) => {
  const { data, isLoading, isError} = useQuery({
    queryKey: ['search', 'genes', query],
    queryFn: () => fetchAPI(`/api/search/v1/search${query ? `?prefix=${query}` : ""}`),
    select: data => data.results
  });

  return (
    <>
      <GeneComparatorTrigger />
      <Container style={{ maxWidth: 1240 }}>
        <Card
          style={{
            marginTop: -80,
          }}
        >
          {query ? (
            <>
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
              <strong>Most searched genes</strong>
            </h1>
          )}
          {isLoading ? (
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
                    {pageData.map((p, i) => (
                      <GeneResult gene={p} key={p.entityId + i} />
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
