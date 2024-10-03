import { PhenotypeSummary } from "@/models/phenotype";
import Head from "next/head";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

type MetadataProps = {
  phenotypeSummary: PhenotypeSummary;
};
const PhenotypeMetadata = ({ phenotypeSummary }: MetadataProps) => {
  const { phenotypeId, phenotypeName } = phenotypeSummary;
  const title = `${phenotypeId} (${phenotypeName}) phenotype | International Mouse Phenotyping Consortium`;
  const description = `Associations data for mouse phenotype ${phenotypeName}. Discover ${phenotypeName} significant genes, associations, procedures and more. Data for phenotype ${phenotypeName} is all freely available for download.`;
  const phenotypePageURL = `${WEBSITE_URL}/data/phenotypes/${phenotypeId}`;
  const jsonLd = {
    "@type": "Dataset",
    "@context": "http://schema.org",
    name: `${phenotypeName} mouse phenotype`,
    description: `Associations data for mouse phenotype ${phenotypeName}. Discover ${phenotypeName} significant genes, associations, procedures and more. Data for phenotype ${phenotypeName} is all freely available for download.`,
    creator: [
      {
        "@type": "Organization",
        name: "International Mouse Phenotyping Consortium",
      },
    ],
    citation: "https://doi.org/10.1093/nar/gkac972",
    isAccessibleForFree: true,
    url: phenotypePageURL,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={`${phenotypeId}, ${phenotypeName}, phenotype, associations, alleles`}
      />
      <link rel="canonical" href={phenotypePageURL} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={phenotypePageURL} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default PhenotypeMetadata;
