import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import _ from "lodash";
import { PhenotypeGenotypes } from "@/models/phenotype";

export const useGeneAssociationsQuery = (
  phenotypeId: string,
  routerIsReady: boolean,
  sortOptions: string,
) => {
  return useQuery({
    queryKey: ['phenotype', phenotypeId, 'genotype-hits'],
    queryFn: () => fetchAPI(`/api/v1/phenotypes/${phenotypeId}/genotype-hits/by-any-phenotype-Id`),
    enabled: routerIsReady,
    select: (data: Array<PhenotypeGenotypes>) => {
      const groups: Record<string, PhenotypeGenotypes> = data.reduce((acc, d) => {
        const {
          phenotype: { id, name },
          alleleAccessionId,
          zygosity,
          sex,
          pValue,
        } = d;

        const key = `${id}-${alleleAccessionId}-${zygosity}`;
        if (acc[key]) {
          if (acc[key].pValue > pValue) {
            acc[key].pValue = Number(pValue);
            acc[key].sex = sex;
          }
        } else {
          acc[key] = { ...d };
        }
        acc[key][`pValue_${sex}`] = Number(pValue);

        return acc;
      }, {});
      const processed = Object.values(groups).map(d => ({
        ...d,
        phenotypeName: d.phenotype.name,
        phenotypeId: d.phenotype.id,
      }));
      const [field, order] = sortOptions.split(';');
      return _.orderBy(processed, field, order as "asc" | "desc") as Array<PhenotypeGenotypes>;
    },
    placeholderData: [],
  });
};