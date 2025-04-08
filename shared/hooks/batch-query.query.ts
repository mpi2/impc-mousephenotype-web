import { useQuery } from "@tanstack/react-query";
import { BatchQueryItem } from "@/models";

const BATCH_QUERY_API_ROOT = process.env.NEXT_PUBLIC_BATCH_QUERY_API_ROOT || "";

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
      const { results, notFoundIds } = response;
      return results.map((gene) => ({
        ...gene,
        alleles: gene.alleles.toSorted(
          (a1, a2) =>
            a2.significantPhenotypes.length - a1.significantPhenotypes.length,
        ),
      }));
    },
  });
};
