import { Metadata } from "next";
import ViabilityChartPage from "./viability-chart-page";
import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import { GeneSummary } from "@/models/gene";

type SearchParams = { [key: string]: string | undefined };

export default async function Page() {
  return <ViabilityChartPage />;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId as string;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const geneSummary = await fetchAPIFromServer<GeneSummary>(
    `/api/v1/genes/${mgiGeneAccessionId}/summary`,
  );
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol } = geneSummary;
  const title = `Viability chart for ${geneSymbol} | International Mouse Phenotyping Consortium`;
  return {
    title: title,
  };
}
