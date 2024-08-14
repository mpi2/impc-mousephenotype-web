import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneStatisticalResult } from "@/models/gene";

const getMutantCount = (dataset: GeneStatisticalResult) => {
  if (!dataset.maleMutantCount && !dataset.femaleMutantCount) {
    return 'N/A';
  }
  return `${dataset.maleMutantCount || 0}m/${dataset.femaleMutantCount || 0}f`;
};


export const useGeneAllStatisticalResData = (
  mgiAccessionId: string,
  enabled: boolean,
) => {
  const {
    data: geneData = [],
    isFetching: isGeneFetching,
    isError: isGeneError,
    ...rest
  } = useQuery({
    queryKey: ['genes', mgiAccessionId, 'statistical-result'],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiAccessionId}/statistical-result`),
    enabled,
    select: (data: Array<GeneStatisticalResult>) => {
      const parsed = data
        .map(dataset => ({
          ...dataset,
          mutantCount: getMutantCount(dataset),
          pValue: Number(dataset.pValue) || 0,
          topLevelPhenotypeList: dataset.topLevelPhenotypes.map((y) => y.name),
        }))
        .filter(dataset =>
          dataset.status !== 'NotProcessed' && !!dataset.topLevelPhenotypes?.length
        ) as Array<GeneStatisticalResult>;
      const groupedData = {};
      parsed.forEach(result => {
        const { mgiGeneAccessionId, parameterStableId, alleleAccessionId, metadataGroup, pValue} = result;
        const hash = `${mgiGeneAccessionId}-${parameterStableId}-${alleleAccessionId}-${metadataGroup}-${pValue}`;
        if (result[hash] === undefined) {
          groupedData[hash] = result;
        }
      });
      return Object.values(parsed) as Array<GeneStatisticalResult>;
    },
    placeholderData: [],
  });
  return {
    geneData,
    isGeneFetching,
    isGeneError,
    rest
  }
}