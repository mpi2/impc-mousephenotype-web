import { PhenotypeSummary } from "@/models/phenotype";
import Head from "next/head";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

type MetadataProps = {
  phenotypeSummary: PhenotypeSummary
}
const PhenotypeMetadata = ({ phenotypeSummary }: MetadataProps) => {
  const { phenotypeId, phenotypeName } = phenotypeSummary;
  const title = `${phenotypeId} (${phenotypeName}) | IMPC Phenotype Information | International Mouse Phenotyping Consortium`;
  const description = `Associations data for mouse phenotype ${phenotypeName}. Discover ${phenotypeName} significant genes, associations, statistics and more. Data for phenotype ${phenotypeName} is all freely available for download.`;
  const genePageURL = `${WEBSITE_URL}/data/phenotypes/${phenotypeId}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta name="keywords" content={`${phenotypeId}, ${phenotypeName}, phenotype, associations, alleles`}/>
      <link rel="canonical" href={genePageURL}/>
      <meta property="og:title" content={title}/>
      <meta property="og:url" content={genePageURL}/>
      <meta property="og:description" content={description}/>
      <meta property="og:type" content="website"/>
    </Head>
  )
};

export default PhenotypeMetadata;