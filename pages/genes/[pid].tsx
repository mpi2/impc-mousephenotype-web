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
import { useEffect } from "react";
import { GeneComparatorTrigger } from "@/components/GeneComparator";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { GeneContext } from "@/contexts";
import { useGeneSummaryQuery } from "@/hooks";

const HumanDiseases = dynamic(
  () => import("@/components/Gene/HumanDiseases"),
  {
    ssr: false,
  }
);

const Gene = () => {
  const router = useRouter();

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
    <GeneContext.Provider value={gene}>
      <GeneComparatorTrigger current={router.query.pid as string} />
      <Search />
      <Container className="page">
        <Summary {...{ gene, loading: isLoading, error: isError ? error.toString(): "" }} />
        {!!gene && (
          <>
            <Phenotypes gene={gene} />
            <Expressions />
            <Images gene={gene} />
            <HumanDiseases gene={gene} />
            <Histopathology />
            <Publications gene={gene} />
            <ExternalLinks />
            <Order gene={gene} />
          </>
        )}
      </Container>
    </GeneContext.Provider>
  );
};

export default Gene;
