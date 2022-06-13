import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Tab, Tabs, Table } from "react-bootstrap";
import Card from "../../Card";
import styles from "./styles.module.scss";

const Scale = ({ children = 5 }: { children: number }) => {
  return (
    <div className={styles.scale}>
      {Array.from(Array(5).keys())
        .map((n) => n + 1)
        .map((n) => (
          <span className={n <= children ? styles.selected : ""} />
        ))}
    </div>
  );
};

const HumanDiseases = () => {
  return (
    <Card id="human-diseases">
      <h2>Human diseases caused by Mavs mutations </h2>
      <Alert variant="secondary">
        <p>
          The analysis uses data from IMPC, along with published data on other
          mouse mutants, in comparison to human disease reports in OMIM,
          Orphanet, and DECIPHER.
        </p>
        <p>
          Phenotype comparisons summarize the similarity of mouse phenotypes
          with human disease phenotypes.
        </p>
      </Alert>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab
          eventKey="significantPhenotypes"
          title="Human diseases associated with Mavs"
        >
          <Alert className={styles.table}>
            No human diseases associated to this gene by orthology or
            annotation.
          </Alert>
        </Tab>
        <Tab
          eventKey="measurementsChart"
          title="Human diseases predicted to be associated with Mavs"
        >
          <Table striped bordered className={styles.table}>
            <thead>
              <tr>
                <th>Disease</th>
                <th>Similarity</th>
                <th>Matching phenotypes</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>
                    Superior Transverse Scapular Ligament, Calcification Of,
                    Familial
                  </strong>
                </td>
                <td>
                  <Scale>{5}</Scale>
                </td>
                <td>
                  <a>Ectopic ossification in ligament tissue</a>
                </td>
                <td>
                  <a target="_blank" href="http://omim.org/entry/601708">
                    OMIM:601708 <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Cystic Angiomatosis Of Bone, Diffuse</strong>
                </td>
                <td>
                  <Scale>{3}</Scale>
                </td>
                <td>
                  <a>Cystic angiomatosis of bone</a>
                </td>
                <td>
                  <a target="_blank" href="http://omim.org/entry/123880">
                    OMIM:123880 <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </td>
              </tr>
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default HumanDiseases;
