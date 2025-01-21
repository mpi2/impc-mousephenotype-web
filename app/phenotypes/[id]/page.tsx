import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import PhenotypePage from "./phenotype-page";
import { Metadata } from "next";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

async function getPhenotypeSummary(phenotypeId: string) {
  let data;
  try {
    data = await fetchAPIFromServer(
      `/api/v1/phenotypes/${phenotypeId}/summary`,
    );
  } catch {
    notFound();
  }

  return data;
}

type PageParams = Promise<{
  id: string;
}>;

export default async function Page({ params }: { params: PageParams }) {
  const phenotypeId = (await params).id;
  const phenotypeData = await getPhenotypeSummary(phenotypeId);
  return <PhenotypePage phenotype={phenotypeData} />;
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const phenotypeId = (await params).id;
  if (!phenotypeId || phenotypeId === "null") {
    notFound();
  }
  const phenotypeSummary = await fetchAPIFromServer(
    `/api/v1/phenotypes/${phenotypeId}/summary`,
  );
  if (!phenotypeSummary) {
    notFound();
  }
  const { phenotypeName } = phenotypeSummary;
  const title = `${phenotypeId} (${phenotypeName}) phenotype | IMPC`;
  const description = `Discover ${phenotypeName} significant genes, associations, procedures and more. Data for phenotype ${phenotypeName} is all freely available for download.`;
  const phenotypePageURL = `${WEBSITE_URL}/data/phenotypes/${phenotypeId}`;
  return {
    title: title,
    description: description,
    keywords: [
      phenotypeId,
      phenotypeName,
      "mouse",
      "gene",
      "phenotypes",
      "alleles",
      "diseases",
    ],
    alternates: { canonical: phenotypePageURL },
    openGraph: {
      title: title,
      url: phenotypePageURL,
      description: description,
      type: "website",
    },
  };
}
