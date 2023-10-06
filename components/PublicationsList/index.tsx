import { Col, Container, Form, InputGroup, Row, Table, Button, Alert } from "react-bootstrap";
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Publication } from "./types";
import styles from './styles.module.scss';
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";
import Pagination from "../Pagination";
import { formatAlleleSymbol } from "../../utils";
import { useDebounce } from "usehooks-ts";


const PublicationLoader = () => (
  <div className={styles.pubLoader}>
    <Skeleton count={3} />
    <Skeleton width={30}/>
    <Skeleton count={3} />
    <Skeleton width={30}/>
  </div>
);

export type PublicationListProps = {
  onlyConsortiumPublications?: boolean;
  filterByGrantAgency?: string;
  prefixQuery?: string;
}

const PublicationsList = (props: PublicationListProps) => {
  const {
    onlyConsortiumPublications,
    filterByGrantAgency,
    prefixQuery = '',
  } = props
  const [abstractVisibilityMap, setAbstractVisibilityMap] = useState(new Map());
  const [meshTermsVisibilityMap, setMeshVisibilityMap] = useState(new Map());
  const displayPubTitle = (pub: Publication) => {
    if (pub.doi) {
      return <p>
        <a
          className="primary link"
          target="_blank"
          href={`https://doi.org/${pub.doi}`}
          dangerouslySetInnerHTML={{ __html: pub.title }}
        />
        <FontAwesomeIcon
          icon={faExternalLinkAlt}
          className="grey"
          size="xs"
        />
      </p>;
    }
    return <p dangerouslySetInnerHTML={{ __html: pub.title }} />;
  }

  const displayPubDate = (pub: Publication) => {
    return moment(pub.publicationDate).format("DD-MM-YYYY")
  }

  const getGrantsList = (pub: Publication) => {
    if (pub.grantsList && pub.grantsList.length > 0) {
      return <p>Grant agency: {pub.grantsList.map(grant => grant.agency).join(' ')}</p>
    }
    return null;
  }

  const isFieldVisible = (pub: Publication, type: 'abstract' | 'mesh-terms') => {
    const map = type === 'abstract' ? abstractVisibilityMap : meshTermsVisibilityMap;
    return !(!map.has(pub.pmId) || map.get(pub.pmId) === 'not-visible');

  }
  const toggleAbstractClass = (pub: Publication, type: 'abstract' | 'mesh-terms') => {
    const map = type === 'abstract' ? abstractVisibilityMap : meshTermsVisibilityMap;
    const setFn = type === 'abstract' ? setAbstractVisibilityMap : setMeshVisibilityMap;
    if (!map.has(pub.pmId) || map.get(pub.pmId) === 'not-visible') {
      map.set(pub.pmId, 'visible');
    } else {
      map.set(pub.pmId, 'not-visible');
    }
    setFn(new Map(map));
  }

  const getDownloadLink = (type:  'tsv' | 'xls') => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/api/v1/publications/${type}/download`;
    if (debounceQuery) {
      url += `?searchQuery=${prefixQuery} ${debounceQuery}`;
    } else if (prefixQuery) {
      url += `?searchQuery=${prefixQuery}`;
    }
    return url;
  }

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const debounceQuery = useDebounce<string>(query, 500);
  const { data: publications, isError, isFetching } = useQuery({
    queryKey: ['publications', prefixQuery, debounceQuery, page, pageSize, onlyConsortiumPublications, filterByGrantAgency],
    queryFn: () => {
      let url = `/api/v1/publications?page=${page}&size=${pageSize}`;
      if (!!onlyConsortiumPublications) {
        url = `/api/v1/publications/by_consortium_paper?consortiumPaper=true&page=${page}&size=${pageSize}`
      }
      if(!!filterByGrantAgency) {
        url = `/api/v1/publications/by_agency?grantAgency=${filterByGrantAgency}&page=${page}&size=${pageSize}`
      }
      if (debounceQuery) {
        url += `&searchQuery=${prefixQuery} ${debounceQuery}`;
      } else if (prefixQuery) {
        url += `&searchQuery=${prefixQuery}`;
      }

      return fetchAPI(url);
    },
    select: response => {
      const prevTotalItems = totalItems;
      const currentTotalItems = response.totalElements;
      if (prevTotalItems !== currentTotalItems) {
        setTotalItems(response.totalElements);
      }
      return response.content as Array<Publication>;
    },
  });

  const updatePage = (value: number) => {
    setPage(value);
  };
  const updatePageSize = (value: number) => {
    setPageSize(value);
  }

  return (
    <Container>
      <Row>
        <Col xs={6} className="mb-3">
          <p>Showing 1 to {Math.min(pageSize, totalItems)} of {totalItems.toLocaleString()} entries</p>
        </Col>
      </Row>
      { !!isError && (
        <Alert variant="primary">
          No publications found that use IMPC mice or data for the filters
        </Alert>
      )}
      <Pagination
        data={publications}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={updatePage}
        onPageSizeChange={updatePageSize}
        controlled
        buttonsPlacement="both"
        additionalTopControls={
          <>
            <div>
              <InputGroup>
                <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
                <Form.Control
                  id="filter"
                  aria-describedby="filter-label"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </InputGroup>
            </div>
            <div>
              Export table:&nbsp;
              <a href={getDownloadLink('tsv')} className="primary link">
                TSV
                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              </a>
              &nbsp;
              or
              &nbsp;
              <a href={getDownloadLink('xls')} className="primary link">
                XLS
                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              </a>
            </div>
          </>
        }
      >
        {pageData => (
          <Table className={styles.pubTable} striped>
            <tbody>
            {pageData?.map((pub: Publication) => (
              <tr key={pub.pmId} id={'pub-' + pub.pmId}>
                <td>
                  {displayPubTitle(pub)}
                  <p><i>{pub.journalTitle}</i>, ({displayPubDate(pub)})</p>
                  <p><b>{pub.authorString}</b></p>
                  <Button
                    className="mt-1 mb-1"
                    variant="outline-dark"
                    size="sm"
                    onClick={e => toggleAbstractClass(pub, 'abstract')}
                  >
                    <strong>{isFieldVisible(pub, 'abstract') ? 'Hide' : 'Show'} abstract</strong>
                  </Button>
                  <p className={`abstract ${isFieldVisible(pub, 'abstract') ? '' : 'visually-hidden'}`}>
                    {pub.abstractText}
                  </p>
                  <p>
                    PMID:&nbsp;
                    <a className="primary link" target="_blank" href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmId}`}>
                      {pub.pmId}
                    </a>
                    &nbsp;
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="grey"
                      size="xs"
                    />
                  </p>
                  {!!pub.alleles && pub.alleles.length > 0 && (
                    <p className={styles.alleleList}>IMPC allele: {pub.alleles.map(allele => {
                      const formattedAllele = formatAlleleSymbol(allele.alleleSymbol);
                      return (
                        <>
                          <a className="primary link" href={`/genes/${allele.mgiGeneAccessionId}`}>
                            {formattedAllele[0]}
                            <sup>{formattedAllele[1]}</sup>
                          </a>
                          &nbsp;
                        </>
                      )
                    })}</p>
                  )}
                  {getGrantsList(pub)}
                  {!!pub.meshHeadingList && pub.meshHeadingList.length > 0 && (
                    <Button
                      className="mt-1 mb-1"
                      variant="outline-dark"
                      size="sm"
                      onClick={e => toggleAbstractClass(pub, 'mesh-terms')}
                    >
                      <strong>{isFieldVisible(pub, 'mesh-terms') ? 'Hide' : 'Show'} mesh terms</strong>
                    </Button>
                  )}
                  <p className={`abstract ${isFieldVisible(pub, 'mesh-terms') ? '' : 'visually-hidden'}`}>
                    {pub.meshHeadingList.join(', ')}
                  </p>
                </td>
              </tr>
            ))}
            { !!isFetching && ([...Array(10)].map((e, i) => (
              <tr>
                <PublicationLoader key={i} />
              </tr>
            ) )) }
            </tbody>
          </Table>
        )}
      </Pagination>
    </Container>
  );
}

export default PublicationsList;