import { Alert, Container } from "react-bootstrap";
import Search from "../../components/Search";
import _ from "lodash";
import Summary from "../../components/Gene/Summary";
import Phenotypes from "../../components/Gene/Phenotypes";
import Card from "../../components/Card";
import Images from "../../components/Gene/Images";
import HumanDiseases from "../../components/Gene/HumanDiseases";
import Publications from "../../components/Gene/Publications";
import Expressions from "../../components/Gene/Expressions";

const Gene = () => {
  return (
    <>
      <Search />
      <Container className="page">
        <Summary />
        <Phenotypes />
        <Expressions />
        <Images />
        <HumanDiseases />
        <Publications />
        <Card>
          <h2>Histopathology</h2>
          <p>
            Summary table of phenotypes displayed during the Histopathology
            procedure which are considered significant. Full histopathology data
            table, including submitted images, can be accessed by clicking any
            row in this table.
          </p>
          <Alert variant="primary">
            There is no histopathology data for Mavs
          </Alert>
        </Card>

        <Card>
          <h2>Order Mouse and ES Cells</h2>
          <p>
            All available products are supplied via our member's centres or
            partnerships. When ordering a product from the IMPC you will be
            redirected to one of their websites or prompted to start an email.
          </p>

          <Alert variant="primary">
            This service may be affected by the Covid-19 pandemic.{" "}
            <a href="https://www.mousephenotype.org/news/impc-covid-19-update/">
              <strong>See how</strong>
            </a>
          </Alert>
        </Card>
      </Container>
    </>
  );
};

export default Gene;
