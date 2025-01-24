import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import GenePage from "./gene-page";
import { processGeneOrderResponse } from "@/hooks/gene-order.query";
import { processGenePhenotypeHitsResponse } from "@/hooks/significant-phenotypes.query";
import {
  GeneSummary,
  emptyGeneSummary,
  GenePhenotypeHits,
} from "@/models/gene";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

async function getGeneSummary(mgiGeneAccessionId: string) {
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const results = await Promise.allSettled([
    fetchAPIFromServer<GeneSummary>(
      `/api/v1/genes/${mgiGeneAccessionId}/summary`,
    ),
    fetchAPIFromServer<Array<GenePhenotypeHits>>(
      `/api/v1/genes/${mgiGeneAccessionId}/phenotype-hits`,
    ),
    fetchAPIFromServer(`/api/v1/genes/${mgiGeneAccessionId}/order`),
  ]);

  const geneData =
    results[0].status === "fulfilled" ? results[0].value : emptyGeneSummary();
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
    gene: geneData,
    significantPhenotypes: sigGeneData,
    orderData: orderGeneData,
  };
}

type PageParams = Promise<{
  pid: string;
}>;

export default async function Page({ params }: { params: PageParams }) {
  const geneId = decodeURIComponent((await params).pid);
  const data = await getGeneSummary(geneId);
  return <GenePage {...data} />;
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
  const geneSummary = await fetchAPIFromServer<GeneSummary>(
    `/api/v1/genes/${mgiGeneAccessionId}/summary`,
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
