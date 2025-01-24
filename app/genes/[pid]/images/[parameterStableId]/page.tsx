import ImageViewerPage from "./image-viewer-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";

type PageParams = Promise<{
  pid: string;
}>;

export default async function Page() {
  return <ImageViewerPage />;
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
  const geneSummary = await fetchAPIFromServer(
    `/api/v1/genes/${mgiGeneAccessionId}/summary`,
  );
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol } = geneSummary;
  const title = `${geneSymbol} image comparator | International Mouse Phenotyping Consortium`;
  return {
    title: title,
  };
}
