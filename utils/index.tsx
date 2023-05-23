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
  const pValueArray = Number.parseFloat(String(pValue))
    .toExponential(2)
    .split("e");
  return (
    <>
      {pValueArray[0]}x10<sup>{pValueArray[1].replace("+", "")}</sup>
    </>
  );
};

export const formatESCellName = (src: string) => {
  const [name, superscript, end] = src.split(/<|>/);
  return (
    <>
      {name}
      <sup>{superscript}</sup>
      {end}
    </>
  );
};

const fetchCache = {};
export { fetchCache };

export const toSentenceCase = (camelCase) => {
  if (camelCase) {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    return result[0].toUpperCase() + result.substring(1).toLowerCase();
  }
  return "";
};
