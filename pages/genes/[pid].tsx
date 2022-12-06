import { Container } from "react-bootstrap";
import Search from "../../components/Search";
import _ from "lodash";
import Summary from "../../components/Gene/Summary";
import Phenotypes from "../../components/Gene/Phenotypes";
import Images from "../../components/Gene/Images";
import Publications from "../../components/Gene/Publications";
import Histopathology from "../../components/Gene/Histopathology";
import Expressions from "../../components/Gene/Expressions";
import Order from "../../components/Gene/Order";
import { useEffect } from "react";
import { GeneComparatorTrigger } from "../../components/GeneComparator";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useQuery from "../../components/useQuery";

const HumanDiseases = dynamic(
  () => import("../../components/Gene/HumanDiseases"),
  {
    ssr: false,
  }
);

const Gene = () => {
  const router = useRouter();
  const [gene, loading, error] = useQuery({
    // query: `/api/v1/genes/${"MGI:1929293" || router.query.pid}/summary`,
    query: `/api/v1/genes/${router.query.pid}/summary`,
  });
  useEffect(() => {
    if (gene) {
      const hash = window.location.hash;
      if (hash.length > 0) {
        setTimeout(() => {
          document.querySelector(window.location.hash).scrollIntoView();
        }, 200);
      }
    }
  }, [gene]);

  return (
    <>
      <GeneComparatorTrigger current={router.query.pid as string} />
      <Search />
      <Container className="page">
        <Summary {...{ gene, loading, error }} />
        {!!gene && (
          <>
            <Phenotypes gene={gene} />
            <Expressions />
            <Images />
            <HumanDiseases gene={gene} />
            <Publications gene={gene} />
            <Histopathology gene={gene} />
            <Order gene={gene} />
          </>
        )}
      </Container>
    </>
  );
};

export default Gene;
