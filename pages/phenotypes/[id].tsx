import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Summary from "../../components/Phenotype/Summary";
import Search from "../../components/Search";

const Phenotype = () => {
  return (
    <>
      <Search isPhenotype />
      <Container className="page">
        <Summary />

        <Card>
          <h2>IMPC Gene variants with abnormal stationary movement</h2>
          <p>Total number of significant genotype-phenotype associations: 61</p>
        </Card>
        <Card>
          <h2>The way we measure</h2>
          <p>Procedure</p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=1157"
            >
              Combined SHIRPA and Dysmorphology
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=72"
            >
              Click-box
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=11"
            >
              Modified SHIRPA
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=1213"
            >
              SHIRPA
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=27"
            >
              Shirpa (GMC)y
            </a>
          </p>
        </Card>
        <Card>
          <h2>Phenotype associations stats</h2>
          <p>
            0.78% of tested genes with null mutations on a B6N genetic
            background have a phenotype association to abnormal stationary
            movement (54/6907)
          </p>
          <p>1.07% females (15/1402) 1.00% males (14/1407)</p>
        </Card>
      </Container>
    </>
  );
};

export default Phenotype;
