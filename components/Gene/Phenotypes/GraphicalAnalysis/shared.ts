export type CatType = "ALL" | "BODY_SYSTEMS" | "PROCEDURES";

export const cats: { [key: string]: CatType } = {
  ALL: "ALL",
  BODY_SYSTEMS: "BODY_SYSTEMS",
  PROCEDURES: "PROCEDURES",
};

export const options = [
  {
    label: "None",
    category: cats.SIGNIFICANT,
  },
  {
    label: "Physiological systems",
    category: cats.BODY_SYSTEMS,
  },

  {
    label: "Procedures",
    category: cats.PROCEDURES,
  },
  // { label: "Sort all by significance", category: cats.ALL },
];

export type Cat = { type: CatType; meta?: any };