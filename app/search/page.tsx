import { Metadata } from "next";
import SearchPage from "./search-page";
import { fetchAPIFromServer } from "@/api-service";
import { PhenotypeSearchResponse } from "@/models/phenotype";
import { GeneSearchResponse } from "@/models/gene";

type SearchParams = {
  term: string;
  type: string;
};

export const metadata: Metadata = {
  title: "IMPC Search | International Mouse Phenotyping Consortium",
};

const fetchSearchResults = async (type: string, term: string) => {
  if (type === "phenotype" || type === "pheno") {
    return await fetchAPIFromServer<PhenotypeSearchResponse>(
      `/api/search/v1/search?prefix=${term}&type=PHENOTYPE`,
    );
  } else {
    return await fetchAPIFromServer<GeneSearchResponse>(
      `/api/search/v1/search?prefix=${term}`,
    );
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const type = searchParams.type;
  const term = searchParams.term;
  const results = await fetchSearchResults(type, term);
  return <SearchPage type={type} term={term} data={results} />;
}
