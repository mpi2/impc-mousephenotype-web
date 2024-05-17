import { GeneSummary } from "@/models/gene";
import Head from "next/head";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

type MetadataProps = {
  geneSummary: GeneSummary
}
const GeneMetadata = ({ geneSummary }: MetadataProps) => {
  const { geneSymbol, geneName, mgiGeneAccessionId } = geneSummary;
  const title = `${geneSymbol} Mouse Gene details | International Mouse Phenotyping Consortium`;
  const description = `Phenotype data for mouse gene ${geneSymbol}. Discover ${geneSymbol}'s significant phenotypes, expression, images, histopathology and more. Data for gene ${geneSymbol} is all freely available for download.`;
  const genePageURL = `${WEBSITE_URL}/data/genes/${mgiGeneAccessionId}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta name="keywords" content={`${geneSymbol}, ${geneName}, gene, phenotypes, alleles`}/>
      <link rel="canonical" href={genePageURL}/>
      <meta property="og:title" content={title}/>
      <meta property="og:url" content={genePageURL}/>
      <meta property="og:description" content={description}/>
      <meta property="og:type" content="website"/>
    </Head>
  )
};

export default GeneMetadata;