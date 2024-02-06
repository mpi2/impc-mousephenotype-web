import styles from "./styles.module.scss";
import { Alert, Badge, Col, Container, Row } from "react-bootstrap";
import { faCaretUp, faCheck, faCross, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRouter } from "next/router";
import Card from "../Card";

import Pagination from "../Pagination";
import { fetchAPI } from "@/api-service";
import { useQuery } from "@tanstack/react-query";
import { PhenotypeSearchResponse, PhenotypeSearchResponseItem } from "@/models/phenotype";
import { BodySystem } from "@/components/BodySystemIcon";
import { ReactNode, useState } from "react";

type Props = {
  phenotype: PhenotypeSearchResponseItem
}

const FilterBadge = ({ children, onClick, icon, isSelected }: { children: ReactNode, onClick: () => void, icon?: any, isSelected: boolean }) => (
  <Badge className={`badge ${isSelected ? 'active' : ''} `} pill bg="badge-secondary" onClick={onClick}>
    {children}&nbsp;
    {!!icon ? <FontAwesomeIcon icon={icon} /> : null}
  </Badge>
)
const PhenotypeResult = ({
  phenotype: {
    entityProperties: {
      mpId,
      phenotypeName,
      synonyms,
      geneCount,
      topLevelParentsArray,
      intermediateLevelParentsArray
    },
  },
}: Props) => {
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
        <Col>
          <h4 className="mb-2 blue-dark">{phenotypeName}</h4>
          <p className="grey small">
            <strong>Synomyms:</strong> {synonymsArray.join(", ")}
          </p>
          {!!parsedGeneCount && parsedGeneCount !== 'N/A' ? (
            <p className="small grey">
              <FontAwesomeIcon className="secondary" icon={faCheck}/>{" "}
              <strong>{parsedGeneCount}</strong> genes associated with this phenotype
            </p>
          ) : (
            <p className="grey small">
              <FontAwesomeIcon className="grey" icon={faCross}/> No IMPC genes
              currently associated with this phenotype
            </p>
          )}
          <p className="grey small">
            <strong>{intermediateLevelParentsArray.length}</strong> intermediate phenotypes
          </p>
        </Col>
        <Col>
          <p className="grey small">Physiol. System</p>
          {topLevelParentsArray.map((x) => (
            <BodySystem key={x.mpId} name={x.mpTerm} hoverColor="black" color="black"/>
          ))}
        </Col>
      </Row>
      <hr className="mt-0 mb-0"/>
    </>
  );
};

const PhenotypeResults = ({query}: { query?: string }) => {

  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const parsePhenotypeString = (value: string) => {
    const [mpId, mpTerm] = value.split('|');
    return {
      mpId: mpId.replace(`___${mpTerm}`, ''),
      mpTerm,
    }
  }

  const { data, isLoading, isError} = useQuery({
    queryKey: ['search', 'phenotypes', query],
    queryFn: () => fetchAPI(`/api/search/v1/search?prefix=${query}&type=PHENOTYPE`),
    select: (data: PhenotypeSearchResponse) => (
      data.results.map(item => ({
        ...item,
        entityProperties: {
          ...item.entityProperties,
          intermediateLevelParentsArray: item.entityProperties.intermediateLevelParents
            .split(';')
            .map(parsePhenotypeString),
          topLevelParentsArray: item.entityProperties.topLevelParents
            .split(';')
            .map(parsePhenotypeString)
        }
      })
      ).sort((p1, p2) =>
        p1.entityProperties.intermediateLevelParentsArray.length - p2.entityProperties.intermediateLevelParentsArray.length
      ) as Array<PhenotypeSearchResponseItem>
    )
  });

  const getSortedData = () => {
    return data.sort(({entityProperties: { intermediateLevelParentsArray: p1 }}, {entityProperties: { intermediateLevelParentsArray: p2 }}) =>
      sort === 'asc' ? p1.length - p2.length : p2.length - p1.length
    );
  }

  return (
    <Container style={{ maxWidth: 1240 }}>
      <Card
        style={{
          marginTop: -80,
        }}
      >
        <h1 style={{ marginBottom: 0 }}>
          <strong>Phenotype search results</strong>
        </h1>
        {!!query && (
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
        )}
        {isLoading ? (
          <p className="grey mt-3 mb-3">Loading...</p>
        ) : (
          <Pagination
            data={getSortedData()}
            additionalTopControls={
              <div className="filtersWrapper">
                Sort by:
                <div className="filter">
                  <strong>No. Intermediate <br/>phenotypes:</strong>
                  <FilterBadge
                    isSelected={sort === 'asc'}
                    icon={faCaretUp}
                    onClick={() => setSort('asc')}
                  >
                    Asc.
                  </FilterBadge>
                  <FilterBadge
                    isSelected={sort === 'desc'}
                    icon={faCaretDown}
                    onClick={() => setSort('desc')}
                  >
                    Desc.
                  </FilterBadge>
                </div>
              </div>
            }
          >
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
