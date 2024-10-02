import { useRouter } from "next/router";
import Search from "../components/Search";
import GeneResults from "../components/GeneResults";
import PhenotypeResults from "../components/PhenotypeResults";
import AlleleResults from "../components/AlleleResults";
import { useState } from "react";
import Head from "next/head";

const SearchResults = () => {
  const router = useRouter();
  const [query, setQuery] = useState((router.query.term as string) || "");
  const { type } = router.query;

  const renderResults = () => {
    switch (type) {
      case "pheno":
        return <PhenotypeResults query={query} />;
      case "allele":
        return <AlleleResults query={query} />;
      default:
        return <GeneResults query={query} />;
    }
  };

  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "Dataset",
    "@id": "http://www.mousephenotype.org",
    name: "Mouse phenotype data of knockout mouse lines for protein-coding genes",
    description: "The International Mouse Phenotyping Consortium (IMPC) is systematically generating mouse knockouts for every protein-coding gene in the mouse genome (approx. 20,000 genes) and carries out high-throughput phenotyping of each line in order to determine gene function by determining the biological systems affected in the absence of the gene. This dataset contains all the genotype-to-phenotype associations, protocols, parameters and measurements currently generated using this approach.",
    url: "http://www.mousephenotype.org",
    keywords: "gene, phenotype, mouse, mammalian, human disease",
    identifier: "DR21.0",
    creator: {
      "@type": "Organization",
      name: "International Mouse Phenotyping Consortium"
    },
    provider: {
      "@type": "Organization",
      name: "International Mouse Phenotyping Consortium"
    },
    version: "21.0",
    dateCreated: "2014",
    dateModified: "2018",
    citation: "Dickinson et al. 2016. High-throughput discovery of novel developmental phenotypes. Nature 537, 508â€“514. PMID: 27626380. doi:10.1038/nature19356",
    temporalCoverage: "2014..",
    sameAs: "http://www.mousephenotype.org",
    distribution: [
      {
        "@type": "DataDownload",
        name: "MySQL database dump",
        fileFormat: "application/octet-stream",
        contentURL: "http://ftp.ebi.ac.uk/pub/databases/impc/release-21.0/"
      },
      {
        "@type": "DataDownload",
        name: "Binary Solr Schemas",
        fileFormat: "application/octet-stream",
        contentURL: "http://ftp.ebi.ac.uk/pub/databases/impc/release-21.0/"
      }
    ],
  }

  return (
    <>
      <Head>
        <title>IMPC Search | International Mouse Phenotyping Consortium</title>
      </Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <Search updateURL onChange={setQuery}/>
      {renderResults()}
    </>
  );
};
export default SearchResults;
