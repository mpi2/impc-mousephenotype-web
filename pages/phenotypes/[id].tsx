import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Summary from "../../components/Phenotype/Summary";
import Search from "../../components/Search";
import Associations from "../../components/PhenotypeGeneAssociations";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";
import ManhattanPlot from "../../components/ManhattanPlot";

const Phenotype = () => {
  const router = useRouter();
  const phenotypeId = router.query.id;

  const { data: phenotype, isLoading, isError } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'summary'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/summary`),
    enabled: router.isReady,
    select: data => ({...data, procedures: data.procedures.filter(p => p.pipelineStableId === "IMPC_001")}),
  });

  const { data } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'genotype-hits'],
    queryFn: () => fetchAPI(`/api/v1/genes/${phenotypeId}/genotype-hits/by-any-phenotype-Id`),
    enabled: router.isReady,
  });


  return (
    <>
      <Search defaultType="phenotype" />
      <Container className="page">
        <Summary {...{ phenotype, isLoading, isError }}/>

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
        <Card>
          <h2>Manhattan Plot</h2>
          <ManhattanPlot phenotypeId={phenotypeId} />
        </Card>
      </Container>
    </>
  );
};

export default Phenotype;
