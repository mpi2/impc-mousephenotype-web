import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import { AlleleResults, GeneResults, PhenotypeResults, Search } from "@/components";

const SearchResults = () => {
  const router = useRouter();
  const [query, setQuery] = useState(
    (router.query.query as string) || ""
  );
  const { type } = router.query;

  const renderResults = () => {
    switch (type) {
      case "phenotype":
        return <PhenotypeResults query={query} />;
      case "allele":
        return <AlleleResults query={query} />;
      default:
        return <GeneResults query={query} />;
    }
  };

  return (
    <>
      <Head>
        <title>IMPC Search | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search updateURL onChange={setQuery} />
      {renderResults()}
    </>
  );
};
export default SearchResults;
