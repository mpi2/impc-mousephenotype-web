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
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AllelesStudiedContext, GeneContext, NumAllelesContext } from "@/contexts";
import { useGeneSummaryQuery } from "@/hooks";
import Head from "next/head";

const HumanDiseases = dynamic(
  () => import("@/components/Gene/HumanDiseases"),
  {
    ssr: false,
  }
);

const Gene = () => {
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

  const {
    isLoading,
    isError,
    data: gene,
    error
  } = useGeneSummaryQuery(router.query.pid as string, router.isReady);

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
    <>
      <Head>
        <title>{gene?.geneSymbol} Mouse Gene details | International Mouse Phenotyping Consortium</title>
      </Head>
      <GeneContext.Provider value={gene}>
        <NumAllelesContext.Provider value={numAllelesContextValue}>
          <AllelesStudiedContext.Provider value={allelesStudiedContextValue}>
            <Search/>
            <Container className="page">
              <Summary {...{gene, numOfAlleles, loading: isLoading, error: isError ? error.toString() : ""}} />
              {!!gene && (
                <>
                  <Phenotypes gene={gene}/>
                  <Expressions/>
                  <Images gene={gene}/>
                  <HumanDiseases gene={gene}/>
                  <Histopathology/>
                  <Publications gene={gene}/>
                  <ExternalLinks/>
                  <Order allelesStudied={allelesStudied} allelesStudiedLoading={allelesStudiedLoading}/>
                </>
              )}
            </Container>
          </AllelesStudiedContext.Provider>
        </NumAllelesContext.Provider>
      </GeneContext.Provider>
    </>
  );
};

export default Gene;
