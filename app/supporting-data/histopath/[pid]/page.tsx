import { Metadata } from "next";
import HistopathChartPage from "./histopath-chart-page";
import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import { GeneSummary } from "@/models/gene";

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
  const geneSummary = await fetchAPIFromServer<GeneSummary>(
    `/api/v1/genes/${mgiGeneAccessionId}/summary`,
  );
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol } = geneSummary;
  const title = `Histopath information for ${geneSymbol} | International Mouse Phenotyping Consortium`;
  return {
    title: title,
  };
}
