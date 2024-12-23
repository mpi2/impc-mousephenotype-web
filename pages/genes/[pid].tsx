import { Container } from "react-bootstrap";
import Search from "@/components/Search";
import {
  Summary,
  GeneMetadata,
  ExternalLinks,
  Images,
  Publications,
  Histopathology,
  Expressions,
  Order,
  Phenotypes,
} from "@/components/Gene";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  AllelesStudiedContext,
  GeneContext,
  NumAllelesContext,
} from "@/contexts";
import {
  processGeneOrderResponse,
  processGenePhenotypeHitsResponse,
  useGeneSummaryQuery,
} from "@/hooks";
import { GeneOrder, GenePhenotypeHits, GeneSummary } from "@/models/gene";
import { fetchAPIFromServer } from "@/api-service";

const HumanDiseases = dynamic(() => import("@/components/Gene/HumanDiseases"), {
  ssr: false,
});

type GenePageProps = {
  gene: GeneSummary;
  significantPhenotypes: Array<GenePhenotypeHits>;
  orderData: Array<GeneOrder>;
};

const GenePage = (props: GenePageProps) => {
  const {
    gene: geneFromServer,
    significantPhenotypes: sigPhenotypesFromServer,
    orderData: orderDataFromServer,
  } = props;
  const router = useRouter();
  const [numOfAlleles, setNumOfAlleles] = useState<number>(null);
  const [allelesStudied, setAlleles] = useState<Array<string>>([]);
  const [allelesStudiedLoading, setAllelesStudiedLoading] =
    useState<boolean>(true);
  const numAllelesContextValue = { numOfAlleles, setNumOfAlleles };
  const allelesStudiedContextValue = {
    allelesStudied,
    setAlleles,
    allelesStudiedLoading,
    setAllelesStudiedLoading,
  };

  const { data: gene } = useGeneSummaryQuery(
    router.query.pid as string,
    router.isReady && !geneFromServer,
    geneFromServer
  );

  const geneData = geneFromServer || gene;

  useEffect(() => {
    if (gene) {
      const hash = window.location.hash;
      if (hash.length > 0) {
        setTimeout(() => {
          document.querySelector(window.location.hash).scrollIntoView();
        }, 500);
      }
    }
  }, [geneData]);

  return (
    <>
      <GeneMetadata geneSummary={geneData} />
      <GeneContext.Provider value={geneData}>
        <NumAllelesContext.Provider value={numAllelesContextValue}>
          <AllelesStudiedContext.Provider value={allelesStudiedContextValue}>
            <Search />
            <Container className="page">
              <Summary {...{ gene: geneData, numOfAlleles }} />
              <Phenotypes
                gene={geneData}
                sigPhenotypesFromServer={sigPhenotypesFromServer}
              />
              <Expressions />
              <Images gene={geneData} />
              <HumanDiseases gene={geneData} />
              <Histopathology />
              <Publications gene={geneData} />
              <ExternalLinks />
              <Order
                allelesStudied={allelesStudied}
                allelesStudiedLoading={allelesStudiedLoading}
                orderDataFromServer={orderDataFromServer}
              />
            </Container>
          </AllelesStudiedContext.Provider>
        </NumAllelesContext.Provider>
      </GeneContext.Provider>
    </>
  );
};

export async function getServerSideProps(context) {
  const { pid: mgiGeneAccessionId } = context.params;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    return { notFound: true };
  }
  const results = await Promise.allSettled([
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/summary`),
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/phenotype-hits`),
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/order`),
  ]);

  const geneData = results[0].status === "fulfilled" ? results[0].value : null;
  const sigGeneData =
    results[1].status === "fulfilled"
      ? processGenePhenotypeHitsResponse(results[1].value)
      : [];
  const orderGeneData =
    results[2].status === "fulfilled"
      ? processGeneOrderResponse(results[2].value)
      : [];

  if (!geneData) {
    return { notFound: true };
  }

  return {
    props: {
      gene: geneData,
      significantPhenotypes: sigGeneData,
      orderData: orderGeneData,
    },
  };
}

export default GenePage;
