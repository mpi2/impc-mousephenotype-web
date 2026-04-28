import { GeneImageCollection, Image } from "@/models/gene";

const bioStudiesIdParameterMap = {
  XRY: "S-BIAD2244", // X-Ray
  EYE: "S-BIAD2786", // Eye Morphology
  ALZ: "S-BIAD2986", // Adult LacZ Expression
  ECH: "S-BIAD2990", // Echocardiography
  ABR: "S-BIAD3008", // Auditory Brain Stem Response
  ECG: "S-BIAD3009", // Electrocardiogram
  SLW: "S-BIAD3012", // Sleep Wake Monitoring
  ELZ: "S-BIAD3019", // Embryo LacZ Expression
  HIS: "S-BIAD3040", // Histopathology
  PAT: "S-BIAD3041", // Gross Pathology and Tissue Collection
  CSD: "S-BIAD3043", // Combined SHIRPA and Dismorphology
  EEI: "S-BIAD3142", // Ear Epidermis Immunophenotyping
  DSS: "S-BIAD3147", // DSS Histology
  ANA: "S-BIAD3148", // Anti-nuclear Antibody Assay
  GEP: "S-BIAD3151", // Gross Morphology Embryo E18.5
  GEO: "S-BIAD3152", // Gross Morphology Embryo E14.5-E15.5
  GEL: "S-BIAD3155", // Gross Morphology Embryo E9.5
  EGR: "S-BIAD3212", // Electroretinography
  GEM: "S-BIAD3213", // Gross Morphology Embryo E12.5
  GPP: "S-BIAD3214", // Gross Morphology Placenta E18.5
  GPO: "S-BIAD3215", // Gross Morphology Placenta E14.5-E15.5
  GPL: "S-BIAD3217", // Gross Morphology Placenta E9.5
  GPM: "S-BIAD3218", // Gross Morphology Placenta E12.5
  IMM: "S-BIAD3234", // Spleen Immunophenotyping
  MLN: "S-BIAD3235", // Mesenteric Lymph Node Immunophenotyping
  BMI: "S-BIAD3236", // Bone Marrow Immunophenotyping
  EML: "S-BIAD3243", // MicroCT E9.5
  EMO: "S-BIAD3290", // MicroCT E14.5-E15.5
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
