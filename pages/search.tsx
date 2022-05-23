import { useRouter } from "next/router";
import Search from "../components/Search";
import GeneResults from "../components/GeneResults";
import PhenotypeResults from "../components/PhenotypeResults";

const SearchResults = () => {
  const router = useRouter();
  const { type } = router.query;

  return (
    <>
      <Search />
      {type === "phenotype" ? <PhenotypeResults /> : <GeneResults />}
    </>
  );
};

export default SearchResults;
