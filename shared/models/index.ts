import * as Gene from './gene';
import * as Phenotype from './phenotype';
import type { PhenotypeRef } from './phenotype-ref';
import { MetabolismGeneData } from "@/pages/metabolism";

export type { PhenotypeRef } from './phenotype-ref';
export type { TableCellProps } from './TableCell'
export type { Gene };
export type { Phenotype };

type Model = PhenotypeRef | typeof Gene | typeof Phenotype | MetabolismGeneData;
export type { Model };