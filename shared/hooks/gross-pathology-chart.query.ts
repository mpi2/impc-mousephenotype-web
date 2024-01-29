import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GrossPathology, GrossPathologyDataset } from "@/models";

export const useGrossPathologyChartQuery = (
  mgiGeneAccessionId: string,
  grossPathParameterStableId: string,
) => {
  return useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "gross-pathology"],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/pathology`),
    placeholderData: [],
    select: (data: Array<GrossPathology>) => {
      const counts = {}
      const filteredData = !!grossPathParameterStableId ? (
        data.filter(d => d.parameterStableId === grossPathParameterStableId)
      ) : data;
      let datasetsFiltered = filteredData
        .flatMap(byParameter => byParameter.datasets);

      datasetsFiltered.forEach(dataset => {
        const isNormal = dataset.ontologyTerms
          .find(ontologyTerm => ontologyTerm.termName === 'no abnormal phenotype detected');
        const key = `${dataset.zygosity}-${dataset.phenotypingCenter}-${isNormal ? 'normal' : 'abnormal'}`;
        if (counts[key] === undefined) {
          counts[key] = 0;
        }
        counts[key] += 1;
      });
      datasetsFiltered = [
        ...new Map(datasetsFiltered.map(d => [
          JSON.stringify([d.zygosity,d.phenotypingCenter]), d
        ])).values()
      ];
      return datasetsFiltered.map(dataset => {
        const abnormalCountsKey  = `${dataset.zygosity}-${dataset.phenotypingCenter}-abnormal`;
        const normalCountsKey  = `${dataset.zygosity}-${dataset.phenotypingCenter}-normal`;
        console.log({abnormalCountsKey, normalCountsKey});
        return {
          ...dataset,
          abnormalCounts: counts[abnormalCountsKey]?.toString() || 'N/A',
          normalCounts: counts[normalCountsKey]?.toString() || 'N/A',
        }
      }) as Array<GrossPathologyDataset>;

    }
  });
}