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
import { GeneSummary } from "@/models/gene";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { fetchAPI } from "@/api-service";

const HumanDiseases = dynamic(
  () => import("@/components/Gene/HumanDiseases"),
  { ssr: false }
);

export const getServerSideProps = (async (context) => {
  const mgiGeneAccessionId = context.params.pid;
  const gene: GeneSummary = await fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/summary`);
  return { props: {gene} }
}) satisfies GetServerSideProps<{ gene: GeneSummary }>

const Gene = ({ gene }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [numOfAlleles, setNumOfAlleles] = useState<number>(null);
  const [allelesStudied, setAlleles] = useState<Array<string>>([]);
  const numAllelesContextValue = {numOfAlleles, setNumOfAlleles};
  const allelesStudiedContextValue = {allelesStudied, setAlleles};

  useEffect(() => {
    if (gene) {
      const hash = window.location.hash;
      if (hash.length > 0) {
        setTimeout(() => {
          document.querySelector(window.location.hash).scrollIntoView();
        }, 500);
      }
    }
  }, [gene]);

  return (
    <GeneContext.Provider value={gene}>
      <NumAllelesContext.Provider value={numAllelesContextValue}>
        <AllelesStudiedContext.Provider value={allelesStudiedContextValue}>
          <GeneComparatorTrigger current={router.query.pid as string} />
          <Search />
          <Container className="page">
            <Summary gene={gene} numOfAlleles={numOfAlleles}/>
            <Phenotypes gene={gene} />
            <Expressions />
            <Images gene={gene} />
            <HumanDiseases gene={gene} />
            <Histopathology />
            <Publications gene={gene} />
            <ExternalLinks />
            <Order allelesStudied={allelesStudied} />
          </Container>
        </AllelesStudiedContext.Provider>
      </NumAllelesContext.Provider>
    </GeneContext.Provider>
  );
};

export default Gene;
