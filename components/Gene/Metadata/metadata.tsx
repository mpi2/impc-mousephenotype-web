import { GeneSummary } from "@/models/gene";
import Head from "next/head";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

type MetadataProps = {
  geneSummary: GeneSummary;
};
const GeneMetadata = ({ geneSummary }: MetadataProps) => {
  if (!geneSummary) {
    return null;
  }
  const { geneSymbol, geneName, mgiGeneAccessionId } = geneSummary;
  const title = `${geneSymbol} | ${geneName} mouse gene | IMPC`;
  const description = `Discover mouse gene ${geneSymbol} significant phenotypes, expression, images, histopathology and more. Data for gene ${geneSymbol} is freely available to download.`;
  const genePageURL = `${WEBSITE_URL}/data/genes/${mgiGeneAccessionId}`;
  const jsonLd = {
    "@type": "Dataset",
    "@context": "http://schema.org",
    name: `Mouse gene ${geneSymbol}`,
    description: `Phenotype data for mouse gene ${geneSymbol}. Includes ${geneSymbol}'s significant phenotypes, expression, images, histopathology and more.`,
    creator: [
      {
        "@type": "Organization",
        name: "International Mouse Phenotyping Consortium",
      },
    ],
    citation: "https://doi.org/10.1093/nar/gkac972",
    isAccessibleForFree: true,
    url: genePageURL,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={`${geneSymbol}, ${geneName}, mouse, gene, phenotypes, alleles, diseases`}
      />
      <link rel="canonical" href={genePageURL} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={genePageURL} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default GeneMetadata;
