import Search from "../../components/Search";
import { Container, Tab, Tabs } from "react-bootstrap";
import Card from "../../components/Card";
import PublicationsList from "../../components/PublicationsList";


const PublicationsPage = () => {
  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>IKMC/IMPC related publications</strong>
          </h1>
          <Tabs defaultActiveKey="all-publications">
            <Tab eventKey="all-publications" title="All publications">
              <PublicationsList />
            </Tab>
            <Tab eventKey="publications-stats" title="Publications stats">
              Tab content for publication stats
            </Tab>
            <Tab eventKey="consortium-publications" title="Consortium publications">
              Tab content for consortium publications
            </Tab>
          </Tabs>
        </Card>
      </Container>
    </>
  )
}

export default PublicationsPage;