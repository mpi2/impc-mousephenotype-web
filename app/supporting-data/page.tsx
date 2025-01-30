import GeneralChartPage from "./supporting-data-page";
import {
  generateDatasetsEndpointUrl,
  sortAndDeduplicateDatasets,
} from "@/hooks/datasets.query";
import { fetchAPIFromServer } from "@/api-service";
import { ChartPageParamsObj } from "@/models/chart";
import { Metadata } from "next";
import { Dataset } from "@/models";

type SearchParams = { [key: string]: string | undefined };

async function getInitialDatasets(
  mgiGeneAccessionId: string,
  searchParams: ChartPageParamsObj,
) {
  const url = generateDatasetsEndpointUrl(mgiGeneAccessionId, searchParams);
  const data = await fetchAPIFromServer<Array<Dataset>>(url);
  return sortAndDeduplicateDatasets(data);
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId as string;
  const initialDatasets = await getInitialDatasets(
    mgiGeneAccessionId,
    searchParams as ChartPageParamsObj,
  );
  return <GeneralChartPage initialDatasets={initialDatasets} />;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {};
  searchParams: SearchParams;
}): Promise<Metadata> {
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId as string;
  const datasets = await getInitialDatasets(
    mgiGeneAccessionId,
    searchParams as ChartPageParamsObj,
  );
  const parameterName = datasets?.[0]?.parameterName;
  const geneSymbol = datasets?.[0]?.geneSymbol;
  const title = `${parameterName} chart for ${geneSymbol} | International Mouse Phenotyping Consortium`;
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
