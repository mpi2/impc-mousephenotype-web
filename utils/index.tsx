import React from "react";
import _ from "lodash";
import { faMars, faMarsAndVenus, faVenus } from "@fortawesome/free-solid-svg-icons";
import { Dataset } from "@/models";

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
  if (!pValue) {
    return 0;
  }
  const pValueArray = Number.parseFloat(String(pValue))
    .toExponential(2)
    .split("e");
  const base = Number(pValueArray[0]);
  const exponent = Number(pValueArray[1]);
  return (
    <>
      {base}
      {exponent !== 0 ? (
        <>
          x10<sup>{pValueArray[1].replace("+", "")}</sup>
        </>
      ) : null}
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

export const csvToJSON = (csv: string) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};

    if (lines[i] == undefined || lines[i].trim() == "") {
      continue;
    }

    const words = lines[i].split(",");
    for (var j = 0; j < words.length; j++) {
      obj[headers[j].trim()] = words[j];
    }

    result.push(obj);
  }
  return result;
};

export const getSexLabel = (sex: string) => {
  switch (sex) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return "Combined";
  }
};

export const getIcon = (sex: string) => {
  switch (sex) {
    case "male":
      return faMars;
    case "female":
      return faVenus;
    default:
      return faMarsAndVenus;
  }
};

export const getSmallestPValue = (summaries: Array<Dataset>): number => {
  const pValues = summaries.map(d => {
    const statMethodPValueKey = d.sex === 'female' ? 'femaleKoEffectPValue' : 'maleKoEffectPValue';
    const pValueFromStatMethod = d.statisticalMethod?.attributes?.[statMethodPValueKey];
    return d.reportedPValue < pValueFromStatMethod ? d.reportedPValue : pValueFromStatMethod;
  }).filter(value => !!value);
  return Math.min(...pValues, 1);
};

export const getDatasetByKey = (summaries: Array<Dataset>, keyToFind: string) => {
  return summaries.find(dataset => {
    const {
      alleleAccessionId,
      parameterStableId,
      zygosity,
      phenotypingCentre,
      colonyId
    } = dataset;
    const key = `${alleleAccessionId}-${parameterStableId}-${zygosity}-${phenotypingCentre}-${colonyId}`;
    return key === keyToFind;
  });
};