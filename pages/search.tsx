import { useRouter } from "next/router";
import Search from "../components/Search";
import GeneResults from "../components/GeneResults";
import PhenotypeResults from "../components/PhenotypeResults";
import { useState } from "react";

const SearchResults = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { type } = router.query;

  return (
    <>
      <Search onChange={setQuery} />
      {type === "phenotype" ? (
        <PhenotypeResults query={query} />
      ) : (
        <GeneResults query={query} />
      )}
    </>
  );
};

export default SearchResults;
