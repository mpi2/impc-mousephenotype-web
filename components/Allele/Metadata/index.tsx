import { AlleleSummary } from "@/models";
import Head from "next/head";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

type MetadataProps = {
  alleleSummary: AlleleSummary;
};
const AlleleMetadata = ({ alleleSummary }: MetadataProps) => {
  const { geneSymbol, alleleName, mgiGeneAccessionId } = alleleSummary;
  const title = `${alleleName} allele of ${geneSymbol} mouse gene | IMPC`;
  const description = `Discover mouse allele ${alleleName} of ${geneSymbol} gene, view all available products and tissues with their detailed information.`;
  const allelePageURL = `${WEBSITE_URL}/data/alleles/${mgiGeneAccessionId}/${alleleName}`;
  const jsonLd = {
    "@type": "Dataset",
    "@context": "http://schema.org",
    name: `Mouse allele ${geneSymbol}<${alleleName}>`,
    description: `Discover mouse allele ${alleleName} of ${geneSymbol} gene, view all available products and tissues with their detailed information.`,
    creator: [
      {
        "@type": "Organization",
        name: "International Mouse Phenotyping Consortium",
      },
    ],
    citation: "https://doi.org/10.1093/nar/gkac972",
    isAccessibleForFree: true,
    url: allelePageURL,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={`${alleleName}, ${geneSymbol}, mouse, allele, gene, crispr, es cells, tissue, targeting vector`}
      />
      <link rel="canonical" href={allelePageURL} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={allelePageURL} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default AlleleMetadata;
