"use client";

import { Container } from "react-bootstrap";
import Search from "@/components/Search";
import {
  Summary,
  ExternalLinks,
  Images,
  Publications,
  Histopathology,
  Expressions,
  Order,
  Phenotypes,
} from "@/components/Gene";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  AllelesStudiedContext,
  GeneContext,
  NumAllelesContext,
} from "@/contexts";
import { useGeneSummaryQuery } from "@/hooks";
import { GeneOrder, GenePhenotypeHits, GeneSummary } from "@/models/gene";
import { useParams } from "next/navigation";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

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
  const params = useParams<{ pid: string }>();
  const [numOfAlleles, setNumOfAlleles] = useState<number | undefined>(
    undefined,
  );
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
    params.pid,
    !!params.pid && !geneFromServer,
    geneFromServer,
  );

  const geneData = geneFromServer || gene;

  useEffect(() => {
    if (gene) {
      const hash = window.location.hash;
      if (hash.length > 0) {
        setTimeout(() => {
          document.querySelector(window.location.hash)?.scrollIntoView();
        }, 500);
      }
    }
  }, [geneData]);

  const jsonLd = {
    "@type": "Dataset",
    "@context": "http://schema.org",
    name: `Mouse gene ${gene.geneSymbol}`,
    description: `Phenotype data for mouse gene ${gene.geneSymbol}. Includes ${gene.geneSymbol}'s significant phenotypes, expression, images, histopathology and more.`,
    creator: [
      {
        "@type": "Organization",
        name: "International Mouse Phenotyping Consortium",
      },
    ],
    citation: "https://doi.org/10.1093/nar/gkac972",
    isAccessibleForFree: true,
    url: `${WEBSITE_URL}/data/genes/${gene.mgiGeneAccessionId}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <>
      <GeneContext.Provider value={geneData}>
        <NumAllelesContext.Provider value={numAllelesContextValue}>
          <AllelesStudiedContext.Provider value={allelesStudiedContextValue}>
            <Search />
            <Container className="page">
              <Summary numOfAlleles={numOfAlleles} />
              <Phenotypes sigPhenotypesFromServer={sigPhenotypesFromServer} />
              <Expressions />
              <Images />
              <HumanDiseases />
              <Histopathology />
              <Publications />
              <ExternalLinks />
              <Order
                allelesStudied={allelesStudied}
                allelesStudiedLoading={allelesStudiedLoading}
                orderDataFromServer={orderDataFromServer}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              />
            </Container>
          </AllelesStudiedContext.Provider>
        </NumAllelesContext.Provider>
      </GeneContext.Provider>
    </>
  );
};

export default GenePage;
