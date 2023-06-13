import { useRouter } from "next/router";
import Search from "../components/Search";
import GeneResults from "../components/GeneResults";
import PhenotypeResults from "../components/PhenotypeResults";
import AlleleResults from "../components/AlleleResults";
import { useState } from "react";

const SearchResults = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
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
      <Search onChange={setQuery} />
      {renderResults()}
    </>
  );
};

export default SearchResults;
