import { useQuery } from "@tanstack/react-query";
import { BatchQueryItem } from "@/models";
import { groupBy, uniqBy, uniq } from "lodash";
import { maybe } from "acd-utils";

const BATCH_QUERY_API_ROOT = process.env.NEXT_PUBLIC_BATCH_QUERY_API_ROOT || "";

function processNewResponse(response: any) {
  return response.map((gene) => {
    const allTerms = uniqBy(
      gene?.goTerms?.flatMap((term) => {
        if (term.direct_ancestors.length === 0) {
          return [{ id: term.go_id, name: term.go_name, aspect: term.aspect }];
        }
        return term.direct_ancestors.map((ant) => {
          const [id, name] = ant;
          return { id, name, aspect: term.aspect };
        });
      }),
      "id",
    );
    return {
      ...gene,
      alleles: gene.alleles.toSorted(
        (a1, a2) =>
          a2.significantPhenotypes.length - a1.significantPhenotypes.length,
      ),
      slimGoTerms: {
        terms: groupBy(allTerms, "aspect"),
        numberOfTerms: allTerms.length,
      },
    };
  });
}

function processOldResponse(data: any) {
  const results = {};
  const resultsByGene = groupBy(data, "id");
  for (const [geneId, geneData] of Object.entries(resultsByGene)) {
    const geneSymbol = geneData[0]?.alleleSymbol.split("<")[0];
    const resultsByAllele = groupBy(geneData, "alleleSymbol");
    const sigSystemsSet = new Set<string>();
    const sigPhenotypesSet = new Set<string>();
    results[geneSymbol] = {
      allSignificantPhenotypes: [],
      allSignificantSystems: [],
      alleles: [],
      geneId,
      humanGeneIds: uniq(geneData.map((d) => d.hgncGeneAccessionId)),
      humanGeneSymbols: uniq(geneData.map((d) => d.humanGeneSymbol)),
      mouseGeneSymbol: geneSymbol,
    };
    for (const [allele, alleleData] of Object.entries(resultsByAllele)) {
      const significantData = alleleData.filter((d) => d.significant === true);
      const restOfData = alleleData.filter((d) => d.significant === false);
      const getSigPhenotypeNames = (data: Array<any>) => {
        return data
          .map((d) =>
            maybe(d.significantPhenotype)
              .map((p) => p.name)
              .getOrElse(undefined),
          )
          .filter(Boolean);
      };
      const getTopLevelPhenotypeNames = (data: Array<any>) => {
        return data
          .flatMap((d) =>
            maybe(d.topLevelPhenotypes)
              .map((systems) => systems.map((s) => s.name))
              .getOrElse(undefined),
          )
          .filter(Boolean);
      };
      const alleleSigPhenotypes = uniq(getSigPhenotypeNames(significantData));
      const alleleSigSystems = uniq(getTopLevelPhenotypeNames(significantData));
      const alleleSigLifeStages = uniq(
        significantData.map((d) => d.lifeStageName),
      );

      alleleSigPhenotypes.forEach((p) => sigPhenotypesSet.add(p));
      alleleSigSystems.forEach((s) => sigSystemsSet.add(s));

      results[geneSymbol].alleles.push({
        allele,
        notSignificantPhenotypes: uniq(getSigPhenotypeNames(restOfData)),
        notSignificantSystems: uniq(getTopLevelPhenotypeNames(restOfData)),
        significantLifeStages: alleleSigLifeStages,
        significantPhenotypes: alleleSigPhenotypes,
        significantSystems: alleleSigSystems,
      });
    }
    results[geneSymbol].allSignificantSystems = [...sigSystemsSet];
    results[geneSymbol].allSignificantPhenotypes = [...sigPhenotypesSet];
    results[geneSymbol].alleles.sort(
      (a1, a2) =>
        a2.significantPhenotypes.length - a1.significantPhenotypes.length,
    );
  }
  return Object.entries(results).map(([geneSymbol, geneData]) => {
    return {
      geneSymbol,
      ...(geneData as any),
    };
  });
}

export const useBatchQuery = (
  tab: string,
  geneIdArray: Array<string>,
  file: File | null,
  formSubmitted: boolean,
  downloadButtonIsBusy: boolean,
) => {
  return useQuery<Array<BatchQueryItem>>({
    queryKey: ["batch-query", geneIdArray, file, tab],
    queryFn: () => {
      const headers = new Headers();
      headers.append("Accept", "application/json");
      if (tab === "paste-your-list") {
        headers.append("Content-Type", "application/json");
      }

      let body;
      if (tab === "upload-your-list") {
        const data = new FormData();
        // @ts-ignore
        data.append("file", file);
        body = data;
      } else {
        body = JSON.stringify({ mgi_ids: geneIdArray });
      }

      return fetch(BATCH_QUERY_API_ROOT, {
        method: "POST",
        body,
        headers,
      }).then((res) => res.json());
    },
    enabled:
      (geneIdArray.length > 0 || !!file) &&
      formSubmitted &&
      !downloadButtonIsBusy,
    select: (response: any) => {
      return response?.[0]?.geneId
        ? processNewResponse(response)
        : processOldResponse(response);
    },
  });
};
