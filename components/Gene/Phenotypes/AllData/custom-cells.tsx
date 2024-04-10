import { GeneStatisticalResult } from "@/models/gene";
import { TableCellProps } from "@/models";
import styles from "@/components/Gene/Phenotypes/AllData/styles.module.scss";
import _ from "lodash";
import { BodySystem } from "@/components/BodySystemIcon";
import Link from "next/link";

export const ParameterCell = <T extends GeneStatisticalResult>(
  props: TableCellProps<T>
) => {
  return (
    <span className={styles.procedureName}>
      <small className="grey">{props.value.procedureName}</small>
      <br />
      <strong>{props.value.parameterName}</strong>
    </span>
  );
};

type PhenotypeIconsCellProps<T> = {
  allPhenotypesField: keyof T;
} & TableCellProps<T>;
export const PhenotypeIconsCell = <T extends GeneStatisticalResult>(props: PhenotypeIconsCellProps<T>) => {
  const phenotypes = (_.get(props.value, props.allPhenotypesField) || []) as Array<{ name: string }>;
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'}}>
      <span>
        {phenotypes.map(({name}) => (
          <BodySystem name={name} color="system-icon in-table primary" noSpacing/>
        ))}
      </span>
    </span>
  )
};

type Props<T> = {
  mpTermIdKey?: keyof T;
} & TableCellProps<T>;
export const SupportingDataCell = <T extends GeneStatisticalResult>(props: Props<T>) => {
  const {
    mgiGeneAccessionId,
    alleleAccessionId,
    zygosity,
    parameterStableId,
    pipelineStableId,
    procedureStableId,
    phenotypingCentre,
  } = props.value;

  let url = `/data/charts?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameterStableId}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;
  if (isAssociatedToPWG) {
    url = "https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/";
  }
  return (
    <Link href={url}>
      <span className="link primary small float-right">Supporting data</span>
    </Link>
  )
};