import { GeneImageCollection, Image } from "@/models/gene";

const bioStudiesIdParameterMap = {
  HIS: "S-BIAD3040",
  CSD: "S-BIAD3043",
  //ECG: "S-BIAD3009",
  //SLW: "S-BIAD3012",
  ALZ: "S-BIAD2986",
  EYE: "S-BIAD2786",
  PAT: "S-BIAD3041",
  XRY: "S-BIAD2244",
  ELZ: "S-BIAD3019",
  ABR: "S-BIAD3008",
  ECH: "S-BIAD2990",
};

const bioStudiesKeys = Object.keys(bioStudiesIdParameterMap);

export const hasImagesOnBioStudies = (parameterStableId: string) => {
  return bioStudiesKeys.some((key) => parameterStableId.includes(key));
};

export const buildFTPPrefix = (
  parameterStableId: string,
  col: GeneImageCollection,
  image: Image,
) => {
  const selectedKey = bioStudiesKeys.find((key) =>
    parameterStableId.includes(key),
  );
  if (!selectedKey) {
    return "";
  } else {
    const selectedId = bioStudiesIdParameterMap[selectedKey];
    const lastThreeDigits = selectedId.slice(-3);
    const {
      phenotypingCentre,
      pipelineStableId,
      procedureStableId,
      parameterStableId,
      biologicalSampleGroup,
    } = col;
    return `S-BIAD/${lastThreeDigits}/${selectedId}/Files/${phenotypingCentre}/${pipelineStableId}/${procedureStableId}/${parameterStableId}/${biologicalSampleGroup}/${image.observationId}`;
  }
};

export const getFTPURL = (
  ftpPrefix: string | undefined = "",
  parameterStableId: string,
  type: "full" | "thumbnail",
) => {
  if (parameterStableId.includes("XRY")) {
    return `https://ftp.ebi.ac.uk/biostudies/fire/${ftpPrefix}_${type}.jpg`;
  } else {
    return `https://ftp.ebi.ac.uk/pub/databases/biostudies/${ftpPrefix}_${type}.jpg`;
  }
};
