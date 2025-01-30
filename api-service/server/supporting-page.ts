import { HistopathologyResponse } from "@/models";
import { fetchAPIFromServer, fetchURL } from "@/api-service";

const KUBERNETES_NAMESPACE = process.env.KUBERNETES_NAMESPACE ?? "default";
const NODE_ENV = process.env.NODE_ENV;

export async function fetchHistopathChartData(
  mgiGeneAccessionId: string,
): Promise<HistopathologyResponse> {
  const endpointURL = `http://impc-histopathology-service.${KUBERNETES_NAMESPACE}:8080/v1/histopathology?mgiGeneAccessionId=${mgiGeneAccessionId}`;
  try {
    return await (NODE_ENV === "development"
      ? fetchAPIFromServer<HistopathologyResponse>(
          `/api/v1/genes/${mgiGeneAccessionId}/histopathology`,
        )
      : fetchURL<HistopathologyResponse>(endpointURL));
  } catch (error) {
    return {
      id: "",
      mgiGeneAccessionId: "",
      datasets: [],
    };
  }
}
