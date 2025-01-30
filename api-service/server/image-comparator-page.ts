import { GeneImageCollection } from "@/models/gene";
import { fetchAPIFromServer, fetchURL } from "@/api-service";

const KUBERNETES_NAMESPACE = process.env.KUBERNETES_NAMESPACE ?? "default";
const NODE_ENV = process.env.NODE_ENV;

export async function fetchMutantImages(
  mgiGeneAccessionId: string,
  parameterStableId: string,
): Promise<Array<GeneImageCollection>> {
  const endpointURL = `http://impc-imaging-service.${KUBERNETES_NAMESPACE}:8080/v1/images/findByMgiAndStableId?mgiGeneAccessionId=${mgiGeneAccessionId}&parameterStableId=${parameterStableId}`;
  try {
    return await (NODE_ENV === "development"
      ? fetchAPIFromServer<Array<GeneImageCollection>>(
          `/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=${mgiGeneAccessionId}&parameterStableId=${parameterStableId}`,
        )
      : fetchURL<Array<GeneImageCollection>>(endpointURL));
  } catch (error) {
    return [];
  }
}

export async function fetchControlImages(
  parameterStableId: string,
): Promise<Array<GeneImageCollection>> {
  const endpointURL = `http://impc-imaging-service.${KUBERNETES_NAMESPACE}:8080/v1/images/findByStableIdAndSampleId?biologicalSampleGroup=control&parameterStableId=${parameterStableId}`;
  try {
    return await (NODE_ENV === "development"
      ? fetchAPIFromServer<Array<GeneImageCollection>>(
          `/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=${parameterStableId}`,
        )
      : fetchURL<Array<GeneImageCollection>>(endpointURL));
  } catch (error) {
    return [];
  }
}
