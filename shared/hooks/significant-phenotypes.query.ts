import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GenePhenotypeHits } from "@/models/gene";
import _ from "lodash";

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
      const group = {};
      data.forEach(item => {
        const {
          phenotype: { id },
          alleleAccessionId,
          zygosity,
          sex,
          pValue,
        } = item;
        const key = `${id}-${alleleAccessionId}-${zygosity}`;
        if (group[key] && group[key].pValue > pValue) {
          group[key].pValue = pValue;
          group[key].sex = sex;
        } else if (group[key] === undefined) {
          const pValueKey = `pValue_${sex}`;
          group[key] = {
            ...item,
            [pValueKey]: pValue,
            topLevelPhenotypeName: item.topLevelPhenotypes?.[0]?.name,
            phenotypeName: item.phenotype.name,
            id: item.phenotype.id,
            phenotypeId: item.phenotype.id,
          };
        }
      });
      const result = Object.values(group);
      console.log('RES', result);
      return _.orderBy(result, "phenotypeName", "asc");
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