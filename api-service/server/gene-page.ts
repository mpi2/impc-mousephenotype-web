import { GeneOrder, GenePhenotypeHits, GeneSummary } from "@/models/gene";
import { fetchAPIFromServer, fetchURL } from "@/api-service";
import { processGeneOrderResponse } from "@/hooks/gene-order.query";
import { processGenePhenotypeHitsResponse } from "@/hooks/significant-phenotypes.query";

const KUBERNETES_NAMESPACE = process.env.KUBERNETES_NAMESPACE ?? "default";
const NODE_ENV = process.env.NODE_ENV;

export async function fetchGeneSummary(
  mgiGeneAccessionId: string,
): Promise<GeneSummary> {
  const endpointURL = `http://impc-summary-service.${KUBERNETES_NAMESPACE}:8080/v1/gene_summary?mgiGeneAccessionId=${mgiGeneAccessionId}`;
  return await (NODE_ENV === "development"
    ? fetchAPIFromServer<GeneSummary>(
        `/api/v1/genes/${mgiGeneAccessionId}/summary`,
      )
    : fetchURL<GeneSummary>(endpointURL));
}

export async function fetchGenePhenotypeHits(
  mgiGeneAccessionId: string,
): Promise<Array<GenePhenotypeHits>> {
  const endpointURL = `http://impc-phenotype-hits-service.${KUBERNETES_NAMESPACE}:8080/v1/phenotypehits?mgiGeneAccessionId=${mgiGeneAccessionId}`;
  const data = await (NODE_ENV === "development"
    ? fetchAPIFromServer<Array<GenePhenotypeHits>>(
        `/api/v1/genes/${mgiGeneAccessionId}/phenotype-hits`,
      )
    : fetchURL<Array<GenePhenotypeHits>>(endpointURL));
  return processGenePhenotypeHitsResponse(data);
}

export async function fetchGeneOrderData(
  mgiGeneAccessionId: string,
): Promise<Array<GeneOrder>> {
  const endpointURL = `http://impc-order-service.${KUBERNETES_NAMESPACE}:8080/v1/orders?mgiGeneAccessionId=${mgiGeneAccessionId}`;
  const data = await (NODE_ENV === "development"
    ? fetchAPIFromServer<Array<GeneOrder>>(
        `/api/v1/genes/${mgiGeneAccessionId}/order`,
      )
    : fetchURL<Array<GeneOrder>>(endpointURL));
  return processGeneOrderResponse(data);
}
