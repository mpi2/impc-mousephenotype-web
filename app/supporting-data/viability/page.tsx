import { Metadata } from "next";
import ViabilityChartPage from "./viability-chart-page";
import { notFound } from "next/navigation";
import { fetchGeneSummary } from "@/api-service";

type SearchParams = { [key: string]: string | undefined };

export default async function Page() {
  return <ViabilityChartPage />;
}

export async function generateMetadata(
  props: {
    searchParams: Promise<SearchParams>;
  }
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId as string;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const geneSummary = await fetchGeneSummary(mgiGeneAccessionId);
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol } = geneSummary;
  const title = `${geneSymbol} viability chart | International Mouse Phenotyping Consortium`;
  return {
    title: title,
  };
}
