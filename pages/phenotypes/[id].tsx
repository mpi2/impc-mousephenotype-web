import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Summary from "../../components/Phenotype/Summary";
import Search from "../../components/Search";
import Associations from "../../components/PhenotypeGeneAssociations";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";
import { useEffect } from "react";
import mockSummary from "../../mocks/data/phenotypes/MP:0012361/summary.json";
import mockGenotypeHits from "../../mocks/data/phenotypes/MP:0012361/genotype-hits.json";

const Phenotype = () => {
  const router = useRouter();
  const phenotypeId = router.query.id;

  // TODO: remove initial data after service is running
  const { data: phenotype } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'summary'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/summary`),
    enabled: router.isReady,
    select: data => ({...data, procedures: data.procedures.filter(p => p.pipelineStableId === "IMPC_001")}),
    initialData: mockSummary,
  });

  const { data } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'genotype-hits'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/genotype-hits`),
    enabled: router.isReady,
    initialData: mockGenotypeHits,
  });


  return (
    <>
      <Search defaultType="phenotype" />
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
          {phenotype?.procedures.map(prod => (
            <p key={prod.procedureStableId}>
              <a
                className="secondary"
                href={`https://www.mousephenotype.org/impress/ProcedureInfo?procID=${prod.procedureStableKey}`}
              >
                {prod.procedureName}
              </a>
            </p>
          ))}
        </Card>
      </Container>
    </>
  );
};

export default Phenotype;
