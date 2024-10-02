type Attributes = {
  label: string;
  value: string;
  defaultOn: boolean;
};

export const geneAttributes: Array<Attributes> = [
  { label: "MGI gene id", value: "mgi-gene-id", defaultOn: false },
  { label: "MGI gene symbol", value: "mgi-gene-symbol", defaultOn: false },
  { label: "Human ortholog", value: "human-ortholog", defaultOn: false },
  {
    label: "MGI marker synonym",
    value: "mgi-marker-synonym",
    defaultOn: false,
  },
  { label: "MGI marker name", value: "mgi-marker-name", defaultOn: false },
  { label: "MGI marker type", value: "mgi-marker-type", defaultOn: false },
  { label: "Mouse status", value: "mouse-status", defaultOn: false },
  { label: "Phenotype status", value: "phenotype-status", defaultOn: false },
  { label: "ES Cell status", value: "es-cell-status", defaultOn: false },
  { label: "Project status", value: "project-status", defaultOn: false },
  { label: "Production center", value: "production-center", defaultOn: false },
  {
    label: "Phenotyping center",
    value: "phenotyping-center",
    defaultOn: false,
  },
];

export const additionalGeneAttributes: Array<Attributes> = [
  { label: "Ensembl gene id", value: "ensembl-gene-id", defaultOn: false },
  { label: "has QC", value: "has-qc", defaultOn: false },
  {
    label: "P-Value (phenotyping significance)",
    value: "p-value",
    defaultOn: false,
  },
  { label: "MP id", value: "mp-id", defaultOn: false },
  { label: "MP term", value: "mp-term", defaultOn: false },
  { label: "MP term synonym", value: "mp-term-synonym", defaultOn: false },
  {
    label: "MP term definition",
    value: "mp-term-definition",
    defaultOn: false,
  },
  { label: "HP id", value: "hp-id", defaultOn: false },
  { label: "HP term", value: "hp-term", defaultOn: false },
  { label: "Disease id", value: "disease-id", defaultOn: false },
  { label: "Disease term", value: "disease-term", defaultOn: false },
];

export const ensemblGeneAttributes: Array<Attributes> = [
  { label: "MGI gene id", value: "mgi-gene-id", defaultOn: true },
  { label: "Ensembl gene id", value: "ensembl-gene-id", defaultOn: true },
  { label: "MGI gene symbol", value: "mgi-gene-symbol", defaultOn: true },
  { label: "Human ortholog", value: "human-ortholog", defaultOn: true },
  { label: "MGI marker synonym", value: "mgi-marker-synonym", defaultOn: true },
  { label: "MGI marker name", value: "mgi-marker-name", defaultOn: true },
  { label: "MGI marker type", value: "mgi-marker-type", defaultOn: true },
  {
    label: "Latest phenotype status",
    value: "latest-phenotype-status",
    defaultOn: true,
  },
  {
    label: "Latests mouse status",
    value: "latest-mouse-status",
    defaultOn: true,
  },
  { label: "ES Cell status", value: "es-cell-status", defaultOn: false },
  { label: "Project status", value: "project-status", defaultOn: false },
  { label: "Production center", value: "production-center", defaultOn: false },
  {
    label: "Phenotyping center",
    value: "phenotyping-center",
    defaultOn: false,
  },
];

export const additionalEnsemblGeneAttributes: Array<Attributes> = [
  { label: "has QC", value: "has-qc", defaultOn: false },
  {
    label: "P-Value (phenotyping significance)",
    value: "p-value",
    defaultOn: false,
  },
  { label: "MP id", value: "mp-id", defaultOn: false },
  { label: "MP term", value: "mp-term", defaultOn: false },
  { label: "MP term synonym", value: "mp-term-synonym", defaultOn: false },
  {
    label: "MP term definition",
    value: "mp-term-definition",
    defaultOn: false,
  },
  { label: "HP id", value: "hp-id", defaultOn: false },
  { label: "HP term", value: "hp-term", defaultOn: false },
  { label: "Disease id", value: "disease-id", defaultOn: false },
  { label: "Disease term", value: "disease-term", defaultOn: false },
];

export const mpAttributes: Array<Attributes> = [
  { label: "MP id", value: "mp-id", defaultOn: true },
  { label: "MP term", value: "mp-term", defaultOn: true },
  { label: "MP definition", value: "mp-definition", defaultOn: true },
  { label: "MGI gene id", value: "mgi-gene-id", defaultOn: true },
  { label: "MGI gene symbol", value: "mgi-gene-symbol", defaultOn: true },
  { label: "Human ortholog", value: "human-ortholog", defaultOn: true },
];

export const additionalMPAttributes: Array<Attributes> = [
  { label: "Top level MP id", value: "toplevel-mp-id", defaultOn: false },
  { label: "Top level MP term", value: "toplevel-mp-term", defaultOn: false },
  { label: "HP id", value: "hp-id", defaultOn: false },
  { label: "HP term", value: "hp-term", defaultOn: false },
  { label: "Disease id", value: "disease-id", defaultOn: false },
  { label: "Disease term", value: "disease-term", defaultOn: false },
];

export const hpAttributes: Array<Attributes> = [
  { label: "HP id", value: "hp-id", defaultOn: true },
  { label: "HP term", value: "hp-term", defaultOn: true },
  { label: "MP id", value: "mp-id", defaultOn: true },
  { label: "MP term", value: "mp-term", defaultOn: true },
  { label: "MP definition", value: "mp-definition", defaultOn: true },
  { label: "MGI gene id", value: "mgi-gene-id", defaultOn: true },
  { label: "MGI gene symbol", value: "mgi-gene-symbol", defaultOn: true },
  { label: "Human ortholog", value: "human-ortholog", defaultOn: true },
];

export const additionalHPAttributes: Array<Attributes> = [
  { label: "Top level MP id", value: "toplevel-mp-id", defaultOn: false },
  { label: "Top level MP term", value: "toplevel-mp-term", defaultOn: false },
  { label: "Disease id", value: "disease-id", defaultOn: false },
  { label: "Disease term", value: "disease-term", defaultOn: false },
];

export const diseaseAttributes: Array<Attributes> = [
  { label: "Disease id", value: "disease-id", defaultOn: true },
  { label: "Disease term", value: "disease-term", defaultOn: true },
  { label: "MGI gene symbol", value: "mgi-gene-symbol", defaultOn: true },
  { label: "MGI gene id", value: "mgi-gene-id", defaultOn: true },
  { label: "HGNC gene symbol", value: "HGNC gene symbol", defaultOn: true },
];

export const additionalAnatomyAttributes: Array<Attributes> = [
  {
    label: "Selected top level anatomy id",
    value: "selected-toplevel-mp-id",
    defaultOn: false,
  },
  {
    label: "Selected top level anatomy term",
    value: "toplevel-mp-term",
    defaultOn: false,
  },
];

export const anatomyAttributes: Array<Attributes> = [
  { label: "Anatomy id", value: "anatomy-id", defaultOn: true },
  { label: "Anatomy term", value: "anatomy-term", defaultOn: true },
  { label: "MGI gene id", value: "mgi-gene-id", defaultOn: true },
  { label: "MGI gene symbol", value: "mgi-gene-symbol", defaultOn: true },
  { label: "Human ortholog", value: "human-ortholog", defaultOn: true },
];

export const mapAttributes: Record<string, Array<Attributes>> = {
  "impc-gene": geneAttributes,
  "ensembl-gene": ensemblGeneAttributes,
  "mp-id": mpAttributes,
  "hp-id": hpAttributes,
  "decipher-id": diseaseAttributes,
  anatomy: anatomyAttributes,
  "human-marker-symbol": geneAttributes,
  "mouse-marker-symbol": geneAttributes,
};

export const mapAdditionalAttributes: Record<string, Array<Attributes>> = {
  "impc-gene": additionalGeneAttributes,
  "ensembl-gene": additionalEnsemblGeneAttributes,
  "mp-id": additionalMPAttributes,
  "hp-id": additionalHPAttributes,
  "decipher-id": [],
  anatomy: additionalAnatomyAttributes,
  "human-marker-symbol": additionalGeneAttributes,
  "mouse-marker-symbol": additionalGeneAttributes,
};
