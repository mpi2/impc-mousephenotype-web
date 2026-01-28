import { useQuery } from "@tanstack/react-query";
import { fetchAPI, fetchDataFromSOLR } from "@/api-service";
import { Dataset } from "@/models";

function getViabilityStatement(value: string) {
  switch (value) {
    case "Homozygous - Viable":
    case "Heterozygous - Viable":
    case "Hemizygous - Viable":
      return "Viable";

    case "Homozygous - Subviable":
    case "Homozygous - Reduced Life Span":
      return "Subviable";

    case "Homozygous - Lethal":
    case "Hemizygous - Lethal":
      return "Lethal";
    default:
      return "Call not made";
  }
}

function deduplicateData(data: Array<any>) {
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
        key,
      };
    }
    return acc;
  }, {});
  return Object.values(groupedData) as Array<Dataset>;
}

export const useViabilityQuery = (
  mgiGeneAccessionId: string,
  routerIsReady: boolean,
) => {
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "all", "viability"],
    queryFn: async () => {
      let datasets: Array<Dataset> = await fetchAPI(
        `/api/v1/genes/${mgiGeneAccessionId}/dataset/viability`,
      );
      datasets = deduplicateData(datasets);
      const summariesRequest = await Promise.allSettled(
        datasets.map((dataset) => {
          const query = `experiment/select?q=gene_symbol: "${dataset.geneSymbol}" AND procedure_stable_id: "${dataset.procedureStableId}" AND parameter_stable_id: "${dataset.parameterStableId}" AND allele_symbol: "${dataset.alleleSymbol}" AND colony_id: "${dataset.colonyId}" AND zygosity: "${dataset.zygosity}" AND phenotyping_center: "${dataset.phenotypingCentre}"`;
          return fetchDataFromSOLR(query);
        }),
      );

      return summariesRequest
        .filter((response) => response.status === "fulfilled")
        .map((response: PromiseFulfilledResult<any>) => response.value.response)
        .map((data) => {
          if (data.numFound === 1) {
            const experimentalData = data.docs[0];
            const matchingDataset = datasets.find(
              (d) =>
                d.procedureStableId === experimentalData.procedure_stable_id &&
                d.parameterStableId === experimentalData.parameter_stable_id,
            );
            const key =
              experimentalData.procedure_stable_id === "IMPC_VIA_002"
                ? "text_value"
                : "category";
            return {
              ...matchingDataset,
              viabilityStatement: getViabilityStatement(experimentalData[key]),
            };
          }
        })
        .filter(Boolean);
    },
    enabled: routerIsReady,
  });
  return {
    viabilityData: data,
    isViabilityLoading: isLoading,
    ...rest,
  };
};
