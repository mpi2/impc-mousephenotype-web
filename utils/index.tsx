import React from "react";
import _ from "lodash";

export const formatBodySystems = (systems: string[] | string = []) => {
  return _.capitalize(
    (typeof systems === "string" ? systems : systems.join(", "))
      .replace(/ phenotype/g, "")
      .replace(/\//g, " / ")
  );
};

export const formatAlleleSymbol = (allele: string) => {
  return allele.slice(0, allele.length - 1).split("<");
};

export const formatPValue = (pValue: number) => {
  const pValueArray = Number.parseFloat(pValue).toExponential(2).split("e");
  return (
    <>
      {pValueArray[0]}x10<sup>{pValueArray[1].replace("+", "")}</sup>
    </>
  );
};
