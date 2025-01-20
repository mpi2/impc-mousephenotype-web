import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import GenePage from "./gene-page";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

import {
  processGeneOrderResponse,
  processGenePhenotypeHitsResponse,
} from "@/hooks";

async function getGeneSummary(mgiGeneAccessionId: string) {
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const results = await Promise.allSettled([
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/summary`),
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/phenotype-hits`),
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/order`),
  ]);

  const geneData = results[0].status === "fulfilled" ? results[0].value : null;
  const sigGeneData =
    results[1].status === "fulfilled"
      ? processGenePhenotypeHitsResponse(results[1].value)
      : [];
  const orderGeneData =
    results[2].status === "fulfilled"
      ? processGeneOrderResponse(results[2].value)
      : [];

  if (!geneData) {
    notFound();
  }

  return {
    props: {
      gene: geneData,
      significantPhenotypes: sigGeneData,
      orderData: orderGeneData,
    },
  };
}

type PageParams = Promise<{
  pid: string;
}>;

export default async function Page({ params }: { params: PageParams }) {
  const geneId = (await params).pid;
  const { props } = await getGeneSummary(geneId);
  return <GenePage {...props} />;
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
    `/api/v1/genes/${mgiGeneAccessionId}/summary`
  );
  if (!geneSummary) {
    notFound();
  }
  const { geneSymbol, geneName } = geneSummary;
  const title = `${geneSymbol} | ${geneName} mouse gene | IMPC`;
  const description = `Discover mouse gene ${geneSymbol} significant phenotypes, expression, images, histopathology and more. Data for gene ${geneSymbol} is freely available to download.`;
  const genePageURL = `${WEBSITE_URL}/data/genes/${mgiGeneAccessionId}`;
  return {
    title: title,
    description: description,
    keywords: [
      geneSymbol,
      geneName,
      "mouse",
      "gene",
      "phenotypes",
      "alleles",
      "diseases",
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
