import { useQuery } from "@tanstack/react-query";
import { csvToJSON } from "@/utils";

type EmbryoWol = {
  colony: string;
  gene_id: string;
  gene_symbol: string;
  wol: string;
  FUSIL: string;
}

export const useEmbryoWOLQuery = (selectFn: (data: Array<EmbryoWol>) => any) => {
  return useQuery({
    queryKey: ['landing-page', 'embryo', 'wol'],
    queryFn: async () => {
      const response = await fetch('https://impc-datasets.s3.eu-west-2.amazonaws.com/embryo-landing-assets/wol_all_dr21.0.tsv');
      const data =  response.ok ? await response.text() : '';
      return new Promise(resolve => resolve(csvToJSON(data, "\t") as Array<EmbryoWol>));
    },
    placeholderData: [],
    select: selectFn,
  });
};