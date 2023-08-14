import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Summary from "../../components/Phenotype/Summary";
import Search from "../../components/Search";
import Associations from "../../components/PhenotypeGeneAssociations";

const Phenotype = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      if (!router.query.id) return;
      try {
        const res = await fetch(
          `/api/v1/phenotypes/MP:0012361/geneAssociations`
        );
        if (res.ok) {
          const associatsions = await res.json();
          setData(associatsions);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [router.query.id]);
  return (
    <>
      <Search isPhenotype />
      <Container className="page">
        <Summary />

        <Card>
          <h2>IMPC Gene variants with abnormal stationary movement</h2>
          <p>
            Total number of significant genotype-phenotype associations:{" "}
            {data?.length ?? 0}
          </p>
          {!!data && <Associations data={data} />}
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
      </Container>
    </>
  );
};

export default Phenotype;
