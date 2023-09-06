import { Col, Container, Form, InputGroup, Row, Table, Button, Alert } from "react-bootstrap";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Publication } from "./types";
import styles from './styles.module.scss';
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";
import data from '../../mocks/data/publications/index.json';
import Pagination from "../Pagination";

const PublicationsList = () => {
  const displayPubTitle = (pub: Publication) => {
    return <p>{pub.title}</p>;
  }

  const getGrantsList = (pub: Publication) => {
    return pub.grantsList.map(grant => grant.agency).join(' ');
  }

  const { data: publications, error, isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: () => fetchAPI<Array<Publication>>('/api/v1/publications'),
    select: data => data as Array<Publication>,
    initialData: data
  });

  return (
    <Container>
      <Row>
        <Col xs={6} className="mb-3">
          <p>Showing 1 to 10 of 81 entries (filtered fom 254 total entries)</p>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
            <Form.Control id="filter" aria-describedby="filter-label" />
          </InputGroup>
        </Col>
        <Col xs={3}>
          Export table:&nbsp;
          <a href="#" className="primary link">
            TSV
            <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
          </a>
          &nbsp;
          or
          &nbsp;
          <a href="#" className="primary link">
            XLS
            <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
          </a>
        </Col>
      </Row>
      {
        !!publications && publications.length ? (
          <Pagination data={publications}>
            {pageData => (
              <Table className={styles.pubTable} striped>
                <tbody>
                {pageData.map(pub => (
                  <tr key={pub.pmId}>
                    <td>
                      {displayPubTitle(pub)}
                      <p><i>{pub.journalTitle}</i>, ({pub.publicationDate})</p>
                      <p><b>{pub.authorString}</b></p>
                      <Button variant="outline-dark" size="sm">Show abstract</Button>
                      <p>PMID: {pub.pmId}</p>
                      {!!pub.grantsList.length && (
                        <p>Grant agency: {getGrantsList(pub)}</p>
                      )}
                      <Button variant="outline-dark" size="sm">Show mesh terms</Button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </Table>
            )}
          </Pagination>
        ) : (
          <Alert variant="primary">
            No publications found that use IMPC mice or data for the filters
          </Alert>
        )
      }

    </Container>
  );
}

export default PublicationsList;