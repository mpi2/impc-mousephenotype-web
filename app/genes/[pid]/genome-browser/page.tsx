import { notFound } from "next/navigation";
import { fetchGeneSummary } from "@/api-service";
import GenomeBrowserPage from "./genome-browser-page";

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
