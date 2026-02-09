import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { groupBy, uniqBy } from "lodash";
import tremblayLabData from "./tremblayLab_data.json";

type ExternalLinks = {
  providerName: string;
  providerDescription: string;
  links: Array<{
    href: string;
    label: string;
    mgiGeneAccessionId: string;
    providerName: string;
    description: string;
  }>;
};

type ProviderListResponse = {
  providerName: string;
  providerDescription: string;
};

type ExternalLinkResponse = {
  providerName: string;
  href: string;
  label: string;
  mgiGeneAccessionId: string;
  description?: string;
};

export const useGeneExternalLinksQuery = (
  mgiGeneAccessionId: string,
  routerIsReady: boolean,
) => {
  const { data: providers, isFetching: providersIsFetching } = useQuery({
    queryKey: ["external-links-providers"],
    queryFn: () =>
      fetchAPI<Array<ProviderListResponse>>(
        `/api/v1/genes/gene_external_links/providers`,
      ),
    select: (providerList) =>
      providerList.reduce((acc, provider) => {
        acc[provider.providerName] = provider.providerDescription;
        return acc;
      }, {}) as Record<string, string>,
    placeholderData: [],
  });

  const hasLoadedProvidersData =
    !!providers && Object.keys(providers).length > 0;
  const linksQuery = useQuery({
    queryKey: ["gene", mgiGeneAccessionId, "external-links"],
    queryFn: () =>
      fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/gene_external_links`),
    enabled: routerIsReady && hasLoadedProvidersData,
    select: (linkList: Array<ExternalLinkResponse>) => {
      // Temporal: Remove after database is updated
      let tempData = linkList.concat(
        tremblayLabData.filter(
          (link) => link.mgiGeneAccessionId === mgiGeneAccessionId,
        ),
      );
      const linksByProvider = groupBy(tempData, (link) => link.providerName);
      return Object.entries(linksByProvider)
        .map(([providerName, links]) => ({
          providerName,
          providerDescription: Object.values(providers!).find((desc: string) =>
            desc.includes(providerName),
          ),
          links,
        }))
        .sort((p1, p2) =>
          p1.providerName.localeCompare(p2.providerName),
        ) as Array<ExternalLinks>;
    },
    placeholderData: [],
  });
  return {
    ...linksQuery,
    isFetching: providersIsFetching || linksQuery.isFetching,
  };
};
