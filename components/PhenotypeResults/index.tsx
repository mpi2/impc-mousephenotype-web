import styles from "./styles.module.scss";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { faCheck, faCross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRouter } from "next/router";
import Card from "../Card";

import Pagination from "../Pagination";
import { fetchAPI } from "../../api-service";
import { useQuery } from "@tanstack/react-query";

const PhenotypeResult = ({
  phenotype: {
    entityProperties: { mpId, phenotypeName, synonyms, geneCount },
  },
}) => {
  const router = useRouter();
  const synonymsArray = synonyms.split(";");
  const parsedGeneCount = geneCount.endsWith(';') ? geneCount.replace(';', '') : geneCount;
  return (
    <>
      <Row
        className={styles.result}
        onClick={() => {
          router.push(`/phenotypes/${mpId}`);
        }}
      >
        <Col sm={12}>
          <h4 className="mb-2 text-capitalize blue-dark">{phenotypeName}</h4>
          {/* <p className="grey mb-0 small">
            <strong>Definition:</strong> ???
          </p> */}
          <p className="grey small">
            <strong>Synomyms:</strong> {synonymsArray.join(", ")}
          </p>
          {!!parsedGeneCount && parsedGeneCount !== 'N/A' ? (
            <p className="small grey">
              <FontAwesomeIcon className="secondary" icon={faCheck} />{" "}
              <strong>{parsedGeneCount}</strong> genes associated with this phenotype
            </p>
          ) : (
            <p className="grey small">
              <FontAwesomeIcon className="grey" icon={faCross} /> No IMPC genes
              currently associated with this phenotype
            </p>
          )}
        </Col>
      </Row>
      <hr className="mt-0 mb-0" />
    </>
  );
};

const PhenotypeResults = ({ query }: { query?: string }) => {
  const { data, isLoading, isError} = useQuery({
    queryKey: ['search', 'phenotypes', query],
    queryFn: () => fetchAPI(`/api/search/v1/search?prefix=${query}&type=PHENOTYPE`),
    select: data => data.results
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
            <strong>Phenotype search results</strong>
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
