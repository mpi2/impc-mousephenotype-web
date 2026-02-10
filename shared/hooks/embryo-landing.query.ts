import { useQuery } from "@tanstack/react-query";
import { fetchLandingPageData } from "@/api-service";
import tremblayLabData from "./tremblayLab_embryo_heatmap_data.json";

export const useEmbryoLandingQuery = () => {
  return useQuery({
    queryKey: ["landing-page", "embryo", "wol"],
    queryFn: () => fetchLandingPageData("embryo_landing"),
    placeholderData: {
      primaryViabilityTable: [],
      primaryViabilityChart: [],
      secondaryViabilityData: [],
      embryoDataAvailabilityGrid: [],
    },
    select: (data) => {
      return {
        ...data,
        embryoDataAvailabilityGrid:
          data.embryoDataAvailabilityGrid.concat(tremblayLabData),
      } as EmbryoLandingPageData;
    },
  });
};
