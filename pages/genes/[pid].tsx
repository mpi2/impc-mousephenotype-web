import { Container } from "react-bootstrap";
import Search from "@/components/Search";
import Summary from "@/components/Gene/Summary";
import ExternalLinks from "@/components/Gene/ExternalLinks";
import Phenotypes from "@/components/Gene/Phenotypes";
import Images from "@/components/Gene/Images";
import Publications from "@/components/Gene/Publications";
import Histopathology from "@/components/Gene/Histopathology";
import Expressions from "@/components/Gene/Expressions";
import Order from "@/components/Gene/Order";
import { useEffect, useState } from "react";
import { GeneComparatorTrigger } from "@/components/GeneComparator";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AllelesStudiedContext, GeneContext, NumAllelesContext } from "@/contexts";
import { useGeneSummaryQuery } from "@/hooks";
import Head from "next/head";
import { GeneSummary } from "@/models/gene";
import { fetchAPI } from "@/api-service";
import geneList from '../../mocks/data/all_genes_list.json';

const HumanDiseases = dynamic(
  () => import("@/components/Gene/HumanDiseases"),
  {
    ssr: false,
  }
);

type GenePageProps = {
  gene: GeneSummary;
}

const Gene = (props: GenePageProps) => {
  const { gene: geneFromServer } = props;
  const router = useRouter();
  const [numOfAlleles, setNumOfAlleles] = useState<number>(null);
  const [allelesStudied, setAlleles] = useState<Array<string>>([]);
  const numAllelesContextValue = {numOfAlleles, setNumOfAlleles};
  const allelesStudiedContextValue = {allelesStudied, setAlleles};

  const {data: gene} = useGeneSummaryQuery(router.query.pid as string, router.isReady && !geneFromServer, geneFromServer);

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
      <Head>
        <title>{gene?.geneSymbol} Mouse Gene details | International Mouse Phenotyping Consortium</title>
      </Head>
      <GeneContext.Provider value={geneData}>
        <NumAllelesContext.Provider value={numAllelesContextValue}>
          <AllelesStudiedContext.Provider value={allelesStudiedContextValue}>
            <GeneComparatorTrigger current={router.query.pid as string} />
            <Search />
            <Container className="page">
              <Summary {...{ gene: geneData, numOfAlleles }} />
              <Phenotypes gene={geneData} />
              <Expressions />
              <Images gene={geneData} />
              <HumanDiseases gene={geneData} />
              <Histopathology />
              <Publications gene={geneData} />
              <ExternalLinks />
              <Order allelesStudied={allelesStudied} />
            </Container>
          </AllelesStudiedContext.Provider>
        </NumAllelesContext.Provider>
      </GeneContext.Provider>
    </>
  );
};

export async function getStaticProps(context) {
  const { pid: mgiGeneAccessionId } = context.params;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === 'null') {
    return { notFound: true }
  }
  const data = await fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/summary`);
  return {
    props: { gene: data }
  };
}

export async function getStaticPaths() {
  const paths = geneList.map(geneAccessionId => ({
    params: { pid: geneAccessionId }
  }));
  return { paths, fallback: "blocking" };
}

export default Gene;
