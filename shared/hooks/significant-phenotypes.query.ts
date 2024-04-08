import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GenePhenotypeHits } from "@/models/gene";

export const useSignificantPhenotypesQuery = (
  mgiGeneAccessionId: string,
  routerIsReady: boolean,
) => {
  const {
    data,
    isLoading,
    isError,
    ...rest } = useQuery({
    queryKey: ['genes', mgiGeneAccessionId, 'phenotype-hits'],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/phenotype-hits`),
    enabled: routerIsReady,
    select: (data: Array<GenePhenotypeHits>) => {
      const group: Record<string, GenePhenotypeHits> = {};
      data.forEach(item => {
        const {
          datasetId,
          phenotype: { id},
          alleleAccessionId,
          zygosity,
          sex,
          pValue,
          lifeStageName,
        } = item;
        const key = `${id}-${alleleAccessionId}-${zygosity}-${lifeStageName}`;
        const pValueKey = `pValue_${sex}`;
        if (group[key] !== undefined && group[key].pValue > pValue) {
          group[key].pValue = pValue;
          group[key].sex = sex;
        } else if (group[key] !== undefined && (group[key][pValueKey] === undefined || group[key][pValueKey] > pValue)) {
          group[key][pValueKey] = pValue;
        }
        if (group[key] === undefined) {
          group[key] = {
            ...item,
            [pValueKey]: pValue,
            topLevelPhenotypeName: item.topLevelPhenotypes?.[0]?.name,
            phenotypeName: item.phenotype.name,
            id: item.phenotype.id,
            phenotypeId: item.phenotype.id,
            numberOfDatasets: 1,
          };
        } else if (group[key].datasetId !== datasetId){
          group[key].numberOfDatasets += 1;
        }
      });
      return Object.values(group).filter(phenotype => !phenotype.procedureStableId.includes("HIS"));
    },
    placeholderData: [],
  });
  return {
    phenotypeData: data as Array<GenePhenotypeHits>,
    isPhenotypeLoading: isLoading,
    isPhenotypeError: isError,
    ...rest,
  };
};