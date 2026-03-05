import { Metadata } from "next";
import VignettesPage from "./vignettes-page";

export const metadata: Metadata = {
  title: "IMPC Embryo vignettes | International Mouse Phenotyping Consortium",
};

export default async function Page(
  props: {
    searchParams: Promise<{ gene?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const gene = searchParams.gene ?? "";
  return <VignettesPage gene={gene} />;
}
