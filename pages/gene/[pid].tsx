import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Search from "../../components/Search";
import styles from "./styles.module.scss";
import pData from "./data2.json";
import gData from "./gene.json";
import _ from "lodash";
import Summary from "../../components/Gene/Summary";
import Phenotypes from "../../components/Gene/Phenotypes";
import Card from "../../components/Card";

const Gene = () => {
  const [phenotypeData, setphenotypeData] = useState(null);
  const [geneData, setGeneData] = useState(null);
  useEffect(() => {
    (async () => {
      setphenotypeData(pData);
      setGeneData(gData);
    })();
  }, []);

  return (
    <>
      <Search />
      <Container className={styles.page}>
        <Summary data={phenotypeData} />
        <Phenotypes phenotypes={phenotypeData} gene={geneData} />
        <Card>
          <h2>lacZ Expression</h2>
        </Card>
        <Card>
          <h2>Associated Images</h2>
        </Card>
        <Card>
          <h2>Human diseases caused by Mavs mutations</h2>
        </Card>
        <Card>
          <h2>Histopathology</h2>
        </Card>
        <Card>
          <h2>IMPC related publications</h2>
        </Card>
        <Card>
          <h2>Order Mouse and ES Cells</h2>
        </Card>
      </Container>
    </>
  );
};

export default Gene;
