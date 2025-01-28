import { Metadata } from "next";
import SearchPage from "./search-page";
import {
  fetchGeneSearchResults,
  fetchPhenotypeSearchResults,
} from "@/api-service";

type SearchParams = {
  term: string;
  type: string;
};

export const metadata: Metadata = {
  title: "IMPC Search | International Mouse Phenotyping Consortium",
};

const fetchSearchResults = async (type: string, term: string) => {
  if (type === "phenotype" || type === "pheno") {
    return await fetchPhenotypeSearchResults(term);
  } else {
    return await fetchGeneSearchResults(term);
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const type = searchParams.type ?? "";
  const term = searchParams.term ?? "";
  const results = await fetchSearchResults(type, term);
  console.log(results);
  return <SearchPage type={type} term={term} data={results} />;
}
