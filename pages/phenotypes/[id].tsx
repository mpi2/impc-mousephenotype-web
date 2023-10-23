import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import Card from "@/components/Card";
import Summary from "@/components/Phenotype/Summary";
import Search from "@/components/Search";
import Associations from "@/components/PhenotypeGeneAssociations";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import ManhattanPlot from "@/components/ManhattanPlot";
import { useState } from "react";

const Phenotype = () => {
  const router = useRouter();
  const phenotypeId = router.query.id;

  const [ selectedGenes, setSelectedGenes ] = useState<Array<any>>([]);

  const { data: phenotype, isLoading, isError } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'summary'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/summary`),
    enabled: router.isReady,
    select: data => ({...data, procedures: data.procedures.filter(p => p.pipelineStableId === "IMPC_001")}),
  });

  const { data } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'genotype-hits'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/genotype-hits/by-any-phenotype-Id`),
    enabled: router.isReady,
  });

  const toggleGene = (gene: any) => {
    const findCallback = g => g.mgiGeneAccessionId === gene.mgiGeneAccessionId;
    const isGenePresent = !!selectedGenes.find(findCallback);
    const tempGenes = [...selectedGenes];
    if (isGenePresent) {
      tempGenes.splice(selectedGenes.findIndex(findCallback), 1);
    } else {
      tempGenes.push(gene);
    }
    setSelectedGenes(tempGenes.sort((g1, g2) => g1.geneSymbol.localeCompare(g2.geneSymbol)));
  }

  return (
    <>
      <Search defaultType="phenotype" />
      <Container className="page">
        <Summary {...{ phenotype, isLoading, isError }}/>
        <Card>
          <h2>Genotype-phenotype associations</h2>
          <ManhattanPlot phenotypeId={phenotypeId} onGeneClick={toggleGene} />
        </Card>
        <Card id="associations-table">
          <h2>IMPC Gene variants with abnormal stationary movement</h2>
          <p>
            Total number of significant genotype-phenotype associations:{" "}
            {data?.length ?? 0}
          </p>
          {!!data && <Associations data={data} selectedGenes={selectedGenes} onRemoveSelection={toggleGene} />}
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
