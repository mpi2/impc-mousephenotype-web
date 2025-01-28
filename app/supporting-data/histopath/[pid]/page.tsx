import { Metadata } from "next";
import HistopathChartPage from "./histopath-chart-page";
import { notFound } from "next/navigation";
import { fetchGeneSummary } from "@/api-service";

type PageParams = Promise<{
  pid: string;
}>;

export default async function Page() {
  return <HistopathChartPage />;
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const mgiGeneAccessionId = (await params).pid;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const geneSummary = await fetchGeneSummary(mgiGeneAccessionId);
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol } = geneSummary;
  const title = `Histopath information for ${geneSymbol} | International Mouse Phenotyping Consortium`;
  return {
    title: title,
  };
}
