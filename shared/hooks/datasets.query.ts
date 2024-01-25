import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { Dataset } from "@/models";
import { ParsedUrlQuery } from "node:querystring";


export const useDatasetsQuery = (mgiGeneAccessionId: string, routerQuery: ParsedUrlQuery , enabled: boolean) => {
  const apiUrl = routerQuery.mpTermId
    ? `/api/v1/genes/${mgiGeneAccessionId}/${routerQuery.mpTermId}/dataset/`
    : `/api/v1/genes/dataset/find_by_multiple_parameter?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${routerQuery.alleleAccessionId}&zygosity=${routerQuery.zygosity}&parameterStableId=${routerQuery.parameterStableId}&pipelineStableId=${routerQuery.pipelineStableId}&procedureStableId=${routerQuery.procedureStableId}&phenotypingCentre=${routerQuery.phenotypingCentre}`;
  const { data, ...rest } = useQuery({
    queryKey: [
      "genes",
      routerQuery.mgiGeneAccessionId,
      routerQuery.mpTermId,
      apiUrl,
      "dataset",
    ],
    queryFn: () => fetchAPI(apiUrl),
    enabled,
    select: (data: Array<Dataset>) => {
      data.sort((a, b) => {
        return a["reportedPValue"] - b["reportedPValue"];
      });
      return data?.filter(
        (value, index, self) =>
          self.findIndex((v) => v.datasetId === value.datasetId) === index
      ) as Array<Dataset>;
    },
    placeholderData: []
  });
  return {
    ...rest,
    datasetSummaries: data,
  }
}