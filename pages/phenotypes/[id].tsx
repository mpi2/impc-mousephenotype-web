import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import Card from "@/components/Card";
import {
  Summary,
  PhenotypeGeneAssociations,
  ManhattanPlot,
  PhenotypeMetadata,
} from "@/components/Phenotype";
import Search from "@/components/Search";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI, fetchAPIFromServer } from "@/api-service";
import { PhenotypeSummary } from "@/models/phenotype";
import { PhenotypeContext } from "@/contexts";
import { uniqBy } from "lodash";
import { useMemo } from "react";

type PhenotypePageProps = {
  phenotype: PhenotypeSummary;
};

const sortAndUniqPhenotypeProcedures = (
  data: PhenotypeSummary
): PhenotypeSummary => ({
  ...data,
  procedures: uniqBy(data.procedures, "procedureName").sort((a, b) => {
    return a.procedureName.localeCompare(b.procedureName);
  }),
});

const Phenotype = (props: PhenotypePageProps) => {
  const { phenotype: phenotypeFromServer } = props;
  const router = useRouter();
  const phenotypeId = router.query.id;

  const {
    data: phenotype,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["phenotype", phenotypeId, "summary"],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/summary`),
    enabled: router.isReady && !phenotypeFromServer,
  });

  const phenotypeData = useMemo(() => {
    const selectedData = phenotypeFromServer || phenotype;
    return sortAndUniqPhenotypeProcedures(selectedData);
  }, [phenotypeFromServer, phenotype]);

  return (
    <>
      <PhenotypeMetadata phenotypeSummary={phenotypeData} />
      <PhenotypeContext.Provider value={phenotypeData}>
        <Search defaultType="phenotype" />
        <Container className="page">
          <Summary {...{ phenotype: phenotypeData }} />
          <Card id="associations-table">
            <PhenotypeGeneAssociations />
          </Card>
          <Card>
            <h2>
              Most significant associations for {phenotypeData?.phenotypeName}
            </h2>
            <ManhattanPlot phenotypeId={phenotypeId} />
          </Card>
          <Card>
            <h2>The way we measure</h2>
            <p>Procedure</p>
            {phenotypeData?.procedures.map((prod) => (
              <p key={prod.procedureStableId}>
                <a
                  className="secondary"
                  href={`https://www.mousephenotype.org/impress/search?searchterm=${prod.procedureName}`}
                >
                  {prod.procedureName}
                </a>
              </p>
            ))}
          </Card>
        </Container>
      </PhenotypeContext.Provider>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id: phenotypeId } = context.params;
  const data = await fetchAPIFromServer(
    `/api/v1/phenotypes/${phenotypeId}/summary`
  );

  return {
    props: { phenotype: data },
  };
}

export default Phenotype;
