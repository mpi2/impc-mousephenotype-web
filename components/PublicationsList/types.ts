
export type Publication = {
  paperTitle: string;
  paperURL: string;
  journalName: string;
  firstPubDate: string;
  citatedBy: Array<{ paperTitle: string; paperURL: string; pubDate: string }>;
  author: string;
  abstract: string;
  pmid: string;
  alleles: Array<{geneSymbol: string; alleleSymbol: string}>;
  grantAgency: string;
  meshTerms: string;
}