import { notFound } from "next/navigation";
import { fetchAPIFromServer } from "@/api-service";
import AllelePage from "./allele-page";

async function getAlleleSummary(
  mgiGeneAccessionId: string,
  alleleSymbol: Array<string>
) {
  const parsedAllele = alleleSymbol.join("/");
  if (!mgiGeneAccessionId || mgiGeneAccessionId === "null" || !alleleSymbol) {
    notFound();
  }
  let alleleData;

  try {
    const url = `/api/v1/alleles/${mgiGeneAccessionId}/${parsedAllele}`;
    alleleData = await fetchAPIFromServer(url);
  } catch {
    notFound();
  }
  return alleleData;
}

type PageParams = Promise<{
  pid: string;
  alleleSymbol: Array<string>;
}>;

export default async function Page({ params }: { params: PageParams }) {
  const mgiGeneAccessionId = (await params).pid;
  const alleleSymbol = (await params).alleleSymbol;
  const alleleData = await getAlleleSummary(mgiGeneAccessionId, alleleSymbol);
  return <AllelePage alleleData={alleleData} />;
}
