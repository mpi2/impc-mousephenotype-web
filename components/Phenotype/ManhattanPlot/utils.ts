import { TooltipData } from "@/components/Phenotype/ManhattanPlot/types";

export const validChromosomes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "X",
];

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const getChromosome = (tooltip: TooltipData) => {
  const chromosome = tooltip.chromosome;
  return validChromosomes.includes(chromosome) ? chromosome : null;
};

export const transformPValue = (value: number | null, significant: boolean) => {
  if (value === null) {
    return significant ? 30 : 0;
  }
  if (value === 0 && significant) {
    // put a high value to show they are really significant
    return 30;
  }
  return -Math.log10(value);
};
