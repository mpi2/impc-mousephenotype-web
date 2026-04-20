import { Dataset } from "@/models";

export const dynamic = "force-dynamic";
import GeneralChartPage from "./supporting-data-page";
import { sortAndDeduplicateDatasets } from "@/hooks/datasets.query";
import { fetchAPIFromServer, fetchInitialDatasets } from "@/api-service";
import { ChartPageParamsObj } from "@/models/chart";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type SearchParams = { [key: string]: string | undefined };

async function getInitialDatasets(
  mgiGeneAccessionId: string,
  datasetId: string,
  searchParams: ChartPageParamsObj,
) {
  const data = await fetchInitialDatasets(mgiGeneAccessionId, searchParams);
  if (data.length === 0 && datasetId) {
    const extraSummaries = await fetchAPIFromServer<Array<Dataset>>(
      `/api/v1/genes/${datasetId}/dataset`,
    );
    return sortAndDeduplicateDatasets(extraSummaries);
  }
  return sortAndDeduplicateDatasets(data);
}

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }

  return <GeneralChartPage initialDatasets={[]} />;
}

export async function generateMetadata(props: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId;
  const datasetId = searchParams.datasetId;
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null") {
    notFound();
  }
  const datasets = await getInitialDatasets(
    mgiGeneAccessionId,
    datasetId,
    searchParams as ChartPageParamsObj,
  );
  if (datasets.length === 0) {
    notFound();
  }
  const parameterName = datasets?.[0]?.parameterName;
  const geneSymbol = datasets?.[0]?.geneSymbol;
  const title = `${geneSymbol} chart page | International Mouse Phenotyping Consortium`;
  const description = `View ${parameterName} chart page for mouse gene ${geneSymbol}. Experimental data about ${parameterName} is all freely available for download.`;
  return {
    title: title,
    description: description,
    keywords: [
      parameterName,
      geneSymbol,
      "mouse",
      "gene",
      "phenotypes",
      "alleles",
      "diseases",
    ],
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
  };
}
