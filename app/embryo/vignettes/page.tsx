import { Metadata } from "next";
import VignettesPage from "./vignettes-page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "IMPC Embryo vignettes | International Mouse Phenotyping Consortium",
};

export default async function Page() {
  return (
    <Suspense>
      <VignettesPage />
    </Suspense>
  );
}
