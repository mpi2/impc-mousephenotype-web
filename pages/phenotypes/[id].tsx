import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Summary from "../../components/Phenotype/Summary";
import Search from "../../components/Search";
import Associations from "../../components/PhenotypeGeneAssociations";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";

const Phenotype = () => {
  const phenotype = {
    name: 'Abnormal stationary movement',
    synonyms: 'movement abnormalities, abnormal movement',
    description: 'Altered ability or inability to change body posture or shift a body part.',
    noSignificantGenes: 54,
    percentageTestedGenes: '0.78%',
    noTestedGenes: 6907,
    system: 'adipose tissue phenotype',
  };
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ['phenotype', router.query.id, 'genotype-hits'],
    // TODO: remove default after service is up and running
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${router.query.id || "MP:0012361"}/genotype-hits`),
    enabled: router.isReady
  });
  return (
    <>
      <Search />
      <Container className="page">
        <Summary phenotype={phenotype}/>

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
