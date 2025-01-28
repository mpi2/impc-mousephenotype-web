import { fetchAPIFromServer, fetchURL } from "../index";
import { GeneSearchResponse } from "@/models/gene";
import { PhenotypeSearchResponse } from "@/models/phenotype";

const KUBERNETES_NAMESPACE = process.env.KUBERNETES_NAMESPACE ?? "default";
const NODE_ENV = process.env.NODE_ENV;

export async function fetchGeneSearchResults(
  query: string | undefined,
): Promise<GeneSearchResponse> {
  const endpointURL = `http://impc-search-service.${KUBERNETES_NAMESPACE}:8080/v1/search?prefix=${query}`;
  return await (NODE_ENV === "development"
    ? fetchAPIFromServer<GeneSearchResponse>(
        `/api/search/v1/search?prefix=${query}`,
      )
    : fetchURL<GeneSearchResponse>(endpointURL));
}

export async function fetchPhenotypeSearchResults(
  query: string | undefined,
): Promise<PhenotypeSearchResponse> {
  const endpointURL = `http://impc-search-service.${KUBERNETES_NAMESPACE}:8080/v1/search?type=PHENOTYPE&prefix=${query}`;
  return await (NODE_ENV === "development"
    ? fetchAPIFromServer<PhenotypeSearchResponse>(
        `/api/search/v1/search?prefix=${query}&type=PHENOTYPE`,
      )
    : fetchURL<PhenotypeSearchResponse>(endpointURL));
}
