import { notFound } from "next/navigation";
import LegacyImageViewerPage from "./legacy-image-viewer-page";
import { Metadata } from "next";
import { fetchGeneSummary } from "@/api-service";

type PageParams = Promise<{
  pid: string;
  sangerProcedureName: string;
}>;

export default async function Page({ params }: { params: PageParams }) {
  const mgiGeneAccessionId = (await params).pid;
  const sangerProcedureName = (await params).sangerProcedureName;
  const geneSummary = await fetchGeneSummary(mgiGeneAccessionId);
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null" || !geneSummary) {
    notFound();
  }

  return (
    <LegacyImageViewerPage
      gene={geneSummary}
      mgiGeneAccessionId={mgiGeneAccessionId}
      procedureName={sangerProcedureName}
    />
  );
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
  const title = `${geneSymbol} sanger images viewer | International Mouse Phenotyping Consortium`;
  return {
    title: title,
  };
}
