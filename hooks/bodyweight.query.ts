import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";


export const useBodyWeightQuery = (mgiGeneAccessionId: string, routerIsReady: boolean) => {
  return useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "all", "bodyweight"],
    queryFn: async () => {
      const allData = await fetchAPI(`/api/v1/bodyweight/byMgiGeneAccId?mgiGeneAccId=${mgiGeneAccessionId}`);
      const summariesRequest = await Promise.allSettled(allData.map(dataset =>
        fetchAPI(`/api/v1/genes/${dataset.datasetId}/dataset`)
      ));
      return allData.map((chartData, i) => {
        return {
          ...summariesRequest[i]['value'][0],
          chartData: chartData.dataPoints,
        };
      })
    },
    enabled: routerIsReady,
    placeholderData: []
  })
}