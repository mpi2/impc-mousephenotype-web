import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";


export const useViabilityQuery = (mgiGeneAccessionId: string, routerIsReady: boolean) => {
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "all", "viability"],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/dataset/viability`),
    select: data => {
      const groupedData = data.reduce((acc, d) => {
        const {
          alleleAccessionId,
          parameterStableId,
          zygosity,
          phenotypingCentre,
          colonyId,
        } = d;

        const key = `${alleleAccessionId}-${parameterStableId}-${zygosity}-${phenotypingCentre}-${colonyId}`;
        if (!acc[key]) {
          acc[key] = {
            ...d,
            key
          };
        }
        return acc;
      }, {});
      return Object.values(groupedData);
    },
    enabled: routerIsReady,
  });
  return {
    viabilityData: data,
    isViabilityLoading: isLoading,
    ...rest
  }
}