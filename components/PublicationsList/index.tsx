import { Col, Container, Form, InputGroup, Row, Table, Button } from "react-bootstrap";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useQuery from "../useQuery";
import { Publication } from "./types";
import styles from './styles.module.scss';


const PublicationsList = () => {
  const displayPubTitle = (pub: Publication) => {
    if (pub.paperURL) {
      return <p><a className="primary link" href={pub.paperURL}>{pub.paperTitle}</a></p>;
    } else {
      return <p>{pub.paperTitle}</p>
    }
  }

  const [ publications ] = useQuery<Array<Publication>>({
    query: '/api/v1/publications'
  });
  console.log(publications);
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
      <Table className={styles.pubTable} striped>
        <tbody>
        {publications && publications.length && publications.map(pub => (
          <tr key={pub.pmid}>
            <td>
              {displayPubTitle(pub)}
              <p><i>{pub.journalName}</i>, ({pub.firstPubDate})</p>
              {!!pub.citatedBy.length && (
                <Button variant="outline-dark" size="sm">Cited by ({pub.citatedBy.length})</Button>
              )}
              <p><b>{pub.author}</b></p>
              <Button variant="outline-dark" size="sm">Show abstract</Button>
              <p>PMID: {pub.pmid}</p>
              {pub.grantAgency && (
                <p>Grant agency: {pub.grantAgency}</p>
              )}
              <Button variant="outline-dark" size="sm">Show mesh terms</Button>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default PublicationsList;