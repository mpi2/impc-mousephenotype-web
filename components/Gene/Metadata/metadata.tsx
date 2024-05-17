import { GeneSummary } from "@/models/gene";
import Head from "next/head";

type MetadataProps = {
  geneSummary: GeneSummary
}
const Metadata = ({ geneSummary }: MetadataProps) => {
  const title = `${geneSummary.geneSymbol} Mouse Gene details | ${geneSummary.geneName} | International Mouse Phenotyping Consortium`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={``} />
    </Head>
  )
};

export default Metadata;