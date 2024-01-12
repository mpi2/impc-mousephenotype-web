import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import _ from 'lodash';

type ExternalLink = {
  href: string;
  label: string;
  providerName: string;
}

export const useGeneExternalLinksQuery = (mgiGeneAccessionId: string, routerIsReady: boolean) => {
  const { data: providers } = useQuery({
    queryKey: ['external-links-providers'],
    queryFn: () => fetchAPI(`/api/v1/genes/gene_external_links/providers`),
    select: providerList => providerList.reduce((acc, provider) => {
      acc[provider.providerName] = provider.providerDescription;
      return acc;
    }, {}),
    placeholderData: {}
  });

  const hasLoadedProvidersData = !!providers && Object.keys(providers).length > 0;
  return useQuery({
    queryKey: ['gene', mgiGeneAccessionId, 'external-links'],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/gene_external_links`),
    enabled: routerIsReady && hasLoadedProvidersData,
    select: (data) => {
      const linkList: Array<ExternalLink> = Array.isArray(data) ? data : [data];
      const linksByProvider = _.groupBy(linkList, link => link.providerName);
      const result = Object.entries(linksByProvider).map(([providerName, links]) => ({
        providerName,
        providerDescription: providers[providerName],
        links,
      }));
      result.push({
        providerName: 'NCBI Gene',
        providerDescription: 'Gene integrates information from a wide range of species. A record may include nomenclature, Reference Sequences (RefSeqs), maps, pathways, variations, phenotypes, and links to genome-, phenotype-, and locus-specific resources worldwide.',
        links: [{ href: 'https://www.ncbi.nlm.nih.gov/gene?cmd=search&tool=FlyBase&term=34908', label: '34908', providerName: 'NCBI Gene' }]
      });
      result.push({
        providerName: 'GenBank Nucleotide',
        providerDescription: 'A collection of sequences from several sources, including GenBank, RefSeq, TPA, and PDB.',
        links: [
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=nucleotide&tool=FlyBase&val=AE003413', label: 'AE003413', providerName: 'GenBank Nucleotide' },
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=nucleotide&tool=FlyBase&val=AJ251486', label: 'AJ251486', providerName: 'GenBank Nucleotide' },
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=nucleotide&tool=FlyBase&val=BI238718', label: 'BI238718', providerName: 'GenBank Nucleotide' },
        ]
      });
      result.push({
        providerName: 'GenBank Protein',
        providerDescription: 'A collection of sequences from several sources, including translations from annotated coding regions in GenBank, RefSeq and TPA, as well as records from SwissProt, PIR, PRF, and PDB.',
        links: [
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&tool=FlyBase&val=AAF44944', label: 'AAF44944', providerName: 'GenBank Protein' },
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&tool=FlyBase&val=AAF53463', label: 'AAF53463', providerName: 'GenBank Protein' },
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&tool=FlyBase&val=AAQ23573', label: 'AAQ23573', providerName: 'GenBank Protein' },
        ]
      });
      result.push({
        providerName: 'RefSeq',
        providerDescription: 'A comprehensive, integrated, non-redundant, well-annotated set of reference sequences including genomic, transcript, and protein.',
        links: [
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?tool=FlyBase&val=NM_057384', label: 'NM_057384', providerName: 'RefSeq' },
          { href: 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?tool=FlyBase&val=NP_476732', label: 'NP_476732', providerName: 'RefSeq' },
        ]
      });
      return result;
    },
    placeholderData: []
  });
}