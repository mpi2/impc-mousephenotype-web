import { notFound } from "next/navigation";
import { fetchGeneSummary } from "@/api-service";
import GenomeBrowserPage from "./genome-browser-page";
import { Metadata } from "next";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

type PageParams = Promise<{
  pid: string;
}>;

async function getGeneSummary(mgiGeneAccessionId: string) {
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const geneData = await fetchGeneSummary(mgiGeneAccessionId);
  if (!geneData) {
    notFound();
  }

  return geneData;
}

export default async function Page({ params }: { params: PageParams }) {
  const geneId = decodeURIComponent((await params).pid);
  const data = await getGeneSummary(geneId);
  return <GenomeBrowserPage mgiGeneAccessionId={geneId} geneSummary={data} />;
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const mgiGeneAccessionId = decodeURIComponent((await params).pid);
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const geneSummary = await fetchGeneSummary(mgiGeneAccessionId);
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol, geneName } = geneSummary;
  const title = `${geneSymbol} | ${geneName} genome browser | IMPC`;
  const description = `View genomic data of CRISPR and ES Cell alleles available in a Genome Browser for ${geneSymbol} gene.`;
  const genePageURL = `${WEBSITE_URL}/data/genes/${mgiGeneAccessionId}/genome-browser`;
  return {
    title: title,
    description: description,
    keywords: [
      geneSymbol,
      geneName,
      "mouse",
      "gene",
      "genome",
      "browser",
      "CRISPR",
      "FASTA",
      "ES Cell",
    ],
    alternates: { canonical: genePageURL },
    openGraph: {
      title: title,
      url: genePageURL,
      description: description,
      type: "website",
    },
  };
}
