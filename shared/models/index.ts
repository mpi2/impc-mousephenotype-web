import * as Gene from './gene';
import * as Phenotype from './phenotype';
import type { PhenotypeRef } from './phenotype-ref';
import { MetabolismGeneData } from "@/pages/metabolism";
import { HistopathologyResponse, Histopathology } from './histopathology';
import { Dataset } from './dataset';

export type { PhenotypeRef } from './phenotype-ref';
export type { TableCellProps } from './TableCell';
export type { HistopathologyResponse, Histopathology } from './histopathology';
export type { Dataset } from './dataset';
export type { Gene };
export type { Phenotype };

type Model =
  PhenotypeRef | typeof Gene | typeof Phenotype | MetabolismGeneData | Dataset
  | HistopathologyResponse | Histopathology;
export type { Model };