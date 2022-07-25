import styles from "./styles.module.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
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

const GeneResult = ({
  gene: {
    marker_symbol,
    marker_name,
    marker_synonym,
    mgi_accession_id,
    es_cell_production_status,
    mouse_production_status,
    phenotype_status,
    phenotyping_data_available,
  },
}: {
  gene: any;
}) => {
  const router = useRouter();
  const { addGene, genes } = useGeneComparator();
  const IsInCompare = genes.includes(mgi_accession_id);
  return (
    <>
      <Row
        className={styles.result}
        onClick={() => {
          router.push(`/genes/${mgi_accession_id}`);
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
                  addGene(mgi_accession_id);
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Compare
              </Button>
            )}
            {marker_symbol}
          </p>
          <h3 className="mb-1 text-capitalize">{marker_name}</h3>
          {!!marker_synonym && marker_synonym.length && (
            <p className="grey text-capitalize">
              {(marker_synonym || []).slice(0, 10).join(", ") || "None"}
            </p>
          )}
        </Col>
        <Col sm={4}>
          <p>
            {phenotyping_data_available ? (
              <span>
                <FontAwesomeIcon
                  className={!!phenotype_status ? "secondary" : "grey"}
                  icon={!!phenotype_status ? faCheckCircle : faTimesCircle}
                />{" "}
                <span className="me-4">Phenotyping data</span>
                <FontAwesomeIcon
                  className={!!es_cell_production_status ? "secondary" : "grey"}
                  icon={
                    !!es_cell_production_status ? faCheckCircle : faTimesCircle
                  }
                />{" "}
                <span className="me-4">ES Cells</span>
                <FontAwesomeIcon
                  className={!!mouse_production_status ? "secondary" : "grey"}
                  icon={
                    !!mouse_production_status ? faCheckCircle : faTimesCircle
                  }
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
            <Link href={`/genes/${mgi_accession_id}/#purchase`} scroll={false}>
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
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/genes/search/${query}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    })();
  }, [query]);
  return (
    <>
      <GeneComparatorTrigger />
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
            <small>
              Found {data?.length || 0} entries{" "}
              {!!query && (
                <>
                  matching <strong>"{query}"</strong>
                </>
              )}
            </small>
          </p>
          <Pagination data={data}>
            {(pageData) => {
              return (
                <>
                  {pageData.map((p) => (
                    <GeneResult gene={p} />
                  ))}
                </>
              );
            }}
          </Pagination>
        </Card>
      </Container>
    </>
  );
};

export default GeneResults;
