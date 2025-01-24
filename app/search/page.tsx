import { Metadata } from "next";
import SearchPage from "./search-page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "IMPC Search | International Mouse Phenotyping Consortium",
};

export default async function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
