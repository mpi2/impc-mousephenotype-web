import { notFound } from "next/navigation";
import { fetchAlleleSummary } from "@/api-service";
import AllelePage from "./allele-page";
import { AlleleSummary } from "@/models";
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

async function getAlleleSummary(
  mgiGeneAccessionId: string,
  alleleSymbol: Array<string>,
) {
  const parsedAllele = alleleSymbol.join("/");
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null" || !alleleSymbol) {
    notFound();
  }
  let alleleData: AlleleSummary;

  try {
    alleleData = await fetchAlleleSummary(mgiGeneAccessionId, parsedAllele);
  } catch {
    notFound();
  }
  return alleleData;
}

type PageParams = {
  params: Promise<{
    pid: string;
    alleleSymbol: Array<string>;
  }>;
};

export default async function Page({ params }: PageParams) {
  const mgiGeneAccessionId = (await params).pid;
  const alleleSymbol = (await params).alleleSymbol;
  const alleleData = await getAlleleSummary(mgiGeneAccessionId, alleleSymbol);
  return <AllelePage alleleData={alleleData} />;
}

export async function generateMetadata({ params }: PageParams) {
  const mgiGeneAccessionId = (await params).pid;
  const alleleSymbol = (await params).alleleSymbol;
  const alleleData = await getAlleleSummary(mgiGeneAccessionId, alleleSymbol);
  const { alleleName, geneSymbol } = alleleData;
  const title = `${alleleName} allele of ${geneSymbol} mouse gene | IMPC`;
  const description = `Discover mouse allele ${alleleName} of ${geneSymbol} gene, view all available products and tissues with their detailed information.`;
  const allelePageURL = `${WEBSITE_URL}/data/alleles/${mgiGeneAccessionId}/${alleleName}`;

  return {
    title: title,
    description: description,
    keywords: [
      alleleName,
      geneSymbol,
      "mouse",
      "gene",
      "phenotypes",
      "alleles",
      "diseases",
    ],
    alternates: { canonical: allelePageURL },
    openGraph: {
      title: title,
      url: allelePageURL,
      description: description,
      type: "website",
    },
  };
}
