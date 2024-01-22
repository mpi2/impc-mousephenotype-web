import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { Histopathology, HistopathologyResponse } from "@/models";

type SpecimenData = {
  lifeStageName: string;
  specimenId: string;
  zygosity: string;
  alleleAccessionId: string;
  alleleSymbol: string;
  tissues: Record<string, { maTerm: string, mPathProcessTerm: string, severityScore: string, significanceScore: string }>
}

export const useHistopathologyQuery = (mgiGeneAccessionId: string, routerIsReady: boolean) => {
  return useQuery({
    queryKey: ['histopathology', mgiGeneAccessionId],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/histopathology`),
    enabled: routerIsReady,
    select: (data: HistopathologyResponse) => {
      const specimensData: Record<string, SpecimenData> = {}
      data.datasets.forEach(dataset => {
        dataset.observations.forEach(observation => {
          if (specimensData[observation.specimenId] === undefined) {
            specimensData[observation.specimenId] = {
              tissues: { },
              specimenId: observation.specimenId,
              zygosity: observation.zygosity,
              lifeStageName: observation.lifeStageName,
              alleleAccessionId: observation.alleleAccessionId,
              alleleSymbol: observation.alleleSymbol
            };
          }
          if (specimensData[observation.specimenId].tissues[dataset.tissue] === undefined) {
            specimensData[observation.specimenId].tissues[dataset.tissue] = {
              maTerm: 'N/A',
              mPathProcessTerm: 'N/A',
              severityScore: '0',
              significanceScore: '0',
            }
          }
          if (observation.parameterName.includes('MPATH pathological process term')) {
            specimensData[observation.specimenId].tissues[dataset.tissue].mPathProcessTerm = observation.ontologyTerms[0].termId;
          } else if (observation.parameterName.includes('MA term')) {
            specimensData[observation.specimenId].tissues[dataset.tissue].maTerm = observation.ontologyTerms[0].termId;
          } else if (observation.parameterName.includes('Severity score')) {
            const value = !!observation.ontologyTerms?.length ? observation.ontologyTerms[0].termId : '0';
            specimensData[observation.specimenId].tissues[dataset.tissue].severityScore = value;
          } else if (observation.parameterName.includes('Significance score')) {
            const value = !!observation.ontologyTerms?.length ? observation.ontologyTerms[0].termId : '0';
            specimensData[observation.specimenId].tissues[dataset.tissue].significanceScore = value;
          }
        });
      });
      return Object.entries(specimensData).flatMap(([specimenId, specimen], index) => {
        return Object.entries(specimen.tissues).map(([tissue, data]) => {
          return {
            ...data,
            specimenId,
            tissue,
            lifeStageName: specimen.lifeStageName,
            zygosity: specimen.zygosity,
            specimenNumber: `#${index + 1}`,
          } as Histopathology;
        })
      });
    }
  });
}