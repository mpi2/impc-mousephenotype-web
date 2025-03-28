import { Metadata } from "next";
import EssentialGenesPage from "./essential-genes-page";

export const metadata: Metadata = {
  title: "Essential Genes | International Mouse Phenotyping Consortium",
};

export default async function Page() {
  return <EssentialGenesPage />;
}
