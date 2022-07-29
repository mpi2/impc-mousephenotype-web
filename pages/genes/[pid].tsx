import { Container } from "react-bootstrap";
import Search from "../../components/Search";
import _ from "lodash";
import Summary from "../../components/Gene/Summary";
import Phenotypes from "../../components/Gene/Phenotypes";
import Images from "../../components/Gene/Images";
// import HumanDiseases from "../../components/Gene/HumanDiseases";
import Publications from "../../components/Gene/Publications";
import Histopathology from "../../components/Gene/Histopathology";
import Expressions from "../../components/Gene/Expressions";
import Order from "../../components/Gene/Order";
import { useEffect } from "react";
import { GeneComparatorTrigger } from "../../components/GeneComparator";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const HumanDiseases = dynamic(
  () => import("../../components/Gene/HumanDiseases"),
  {
    ssr: false,
  }
);

const Gene = () => {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length > 0) {
      setTimeout(() => {
        document.querySelector(window.location.hash).scrollIntoView();
      }, 200);
    }
  }, []);
  return (
    <>
      <GeneComparatorTrigger current={router.query.pid} />
      <Search />
      <Container className="page">
        <Summary />
        <Phenotypes />
        <Expressions />
        <Images />
        <HumanDiseases />
        <Publications />
        <Histopathology />
        <Order />
      </Container>
    </>
  );
};

export default Gene;
