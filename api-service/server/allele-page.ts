import { fetchAPIFromServer, fetchURL } from "@/api-service";
import { AlleleSummary } from "@/models";
const KUBERNETES_NAMESPACE = process.env.KUBERNETES_NAMESPACE ?? "default";
const NODE_ENV = process.env.NODE_ENV;

export async function fetchAlleleSummary(
  mgiGeneAccessionId: string,
  alleleName: string,
): Promise<AlleleSummary> {
  const endpointURL = `http://impc-allele-service.${KUBERNETES_NAMESPACE}:8080/v1/alleles?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleName=${alleleName}`;
  return await (NODE_ENV === "development"
    ? fetchAPIFromServer<AlleleSummary>(
        `/api/v1/alleles/${mgiGeneAccessionId}/${alleleName}`,
      )
    : fetchURL<AlleleSummary>(endpointURL));
}
