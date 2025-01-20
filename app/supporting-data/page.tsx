import GeneralChartPage from "./supporting-data-page";
import {
  generateDatasetsEndpointUrl,
  sortAndDeduplicateDatasets,
} from "@/hooks/datasets.query";
import { fetchAPIFromServer } from "@/api-service";
import { CharPageParamsObj } from "@/models/chart";
import { Metadata } from "next";

type SearchParams = { [key: string]: string | undefined };

async function getInitialDatasets(
  mgiGeneAccessionId: string,
  searchParams: CharPageParamsObj,
) {
  const url = generateDatasetsEndpointUrl(mgiGeneAccessionId, searchParams);
  return await fetchAPIFromServer(url).then(sortAndDeduplicateDatasets);
}

export default async function Page({
  searchParams,
}: {
  params: {};
  searchParams: SearchParams;
}) {
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId;
  const initialDatasets = await getInitialDatasets(
    mgiGeneAccessionId,
    searchParams as CharPageParamsObj,
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
  const mgiGeneAccessionId = searchParams.mgiGeneAccessionId;
  const datasets = getInitialDatasets(
    mgiGeneAccessionId,
    searchParams as CharPageParamsObj,
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
