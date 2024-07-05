import { useQuery } from "@tanstack/react-query";
import { csvToJSON } from "@/utils";
import { fetchAPI, fetchLandingPageData } from "@/api-service";

export const useEmbryoLandingQuery = () => {
  return useQuery({
    queryKey: ["landing-page", "embryo", "wol"],
    queryFn: () => fetchLandingPageData("embryo"),
    placeholderData: [],
    select: (data) => data as EmbryoLandingPageData,
  });
};
