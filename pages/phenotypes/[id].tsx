import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import Card from "@/components/Card";
import Summary from "@/components/Phenotype/Summary";
import Search from "@/components/Search";
import Associations from "@/components/PhenotypeGeneAssociations";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import ManhattanPlot from "@/components/ManhattanPlot";
import { PhenotypeSummary } from "@/models/phenotype";
import { PhenotypeContext } from "@/contexts";
import _ from 'lodash';
import Head from "next/head";

const Phenotype = () => {
  const router = useRouter();
  const phenotypeId = router.query.id;

  const { data: phenotype, isLoading, isError } = useQuery({
    queryKey: ['phenotype', phenotypeId, 'summary'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/summary`),
    enabled: router.isReady,
    select: (data: PhenotypeSummary) => ({
      ...data,
      procedures: _.uniqBy(data.procedures, 'procedureName').sort((a, b) => {
        return a.procedureName.localeCompare(b.procedureName);
      }),
    } as PhenotypeSummary),
  });

  return (
    <>
      <Head>
        <title>{`${phenotype?.phenotypeId} (${phenotype?.phenotypeName})`} | IMPC Phenotype Information | International Mouse Phenotyping Consortium</title>
      </Head>
      <PhenotypeContext.Provider value={phenotype}>
      <Search defaultType="phenotype" />
      <Container className="page">
        <Summary {...{ phenotype, isLoading, isError }}/>
        <Card id="associations-table">
          <Associations />
        </Card>
        <Card>
          <h2>Most significant associations for {phenotype?.phenotypeName}</h2>
          <ManhattanPlot phenotypeId={phenotypeId}  />
        </Card>
        <Card>
          <h2>The way we measure</h2>
          <p>Procedure</p>
          {phenotype?.procedures.map(prod => (
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

export default Phenotype;
