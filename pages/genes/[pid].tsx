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
} from "@/components/Gene";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AllelesStudiedContext, GeneContext, NumAllelesContext } from "@/contexts";
import { useGeneSummaryQuery, useScroll } from "@/hooks";
import { GeneSummary } from "@/models/gene";
import { fetchAPI } from "@/api-service";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import geneList from '../../mocks/data/all_genes_list.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";

const HumanDiseases = dynamic(
  () => import("@/components/Gene/HumanDiseases"),
  {ssr: false}
);

const Phenotypes = dynamic(
  () => import("@/components/Gene/Phenotypes"),
  {ssr: false}
);

type GenePageProps = {
  gene: GeneSummary;
}

const Gene = (props: GenePageProps) => {
  const { gene: geneFromServer } = props;
  const router = useRouter();
  const [numOfAlleles, setNumOfAlleles] = useState<number>(null);
  const [allelesStudied, setAlleles] = useState<Array<string>>([]);
  const [allelesStudiedLoading, setAllelesStudiedLoading] = useState<boolean>(true);
  const numAllelesContextValue = {numOfAlleles, setNumOfAlleles};
  const allelesStudiedContextValue = {
    allelesStudied,
    setAlleles,
    allelesStudiedLoading,
    setAllelesStudiedLoading,
  };

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
      <GeneMetadata geneSummary={geneData} />
      <GeneContext.Provider value={geneData}>
        <NumAllelesContext.Provider value={numAllelesContextValue}>
          <AllelesStudiedContext.Provider value={allelesStudiedContextValue}>
            <Search/>
            <Container className="page">
              <Summary {...{ gene: geneData, numOfAlleles }} />
              <Phenotypes gene={geneData} />
              <Expressions />
              <Images gene={geneData} />
              <HumanDiseases gene={geneData} />
              <Histopathology />
              <Publications gene={geneData} />
              <ExternalLinks />
              <Order allelesStudied={allelesStudied} allelesStudiedLoading={allelesStudiedLoading} />
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
