import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import PhenotypePage from "./phenotype-page";

async function getPhenotypeSummary(phenotypeId: string) {
  let data;
  try {
    data = await fetchAPIFromServer(
      `/api/v1/phenotypes/${phenotypeId}/summary`
    );
  } catch {
    return notFound();
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
