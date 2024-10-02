import { GeneStatisticalResult } from "@/models/gene";
import { TableCellProps } from "@/models";
import styles from "@/components/Gene/Phenotypes/AllData/styles.module.scss";
import _ from "lodash";
import { BodySystem } from "@/components/BodySystemIcon";
import Link from "next/link";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Overlay, Tooltip } from "react-bootstrap";
import { useRef, useState } from "react";
import { formatPValue } from "@/utils";
import { useQueryFlags } from "@/hooks";

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
export const PhenotypeIconsCell = <T extends GeneStatisticalResult>(
  props: PhenotypeIconsCellProps<T>
) => {
  const phenotypes = (_.get(props.value, props.allPhenotypesField) ||
    []) as Array<{ name: string }>;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <span>
        {phenotypes.map(({ name }) => (
          <BodySystem name={name} color="system-icon in-table" noSpacing />
        ))}
      </span>
    </span>
  );
};

type Props<T> = {
  mpTermIdKey?: keyof T;
} & TableCellProps<T>;
export const SupportingDataCell = <T extends GeneStatisticalResult>(
  props: Props<T>
) => {
  const {
    mgiGeneAccessionId,
    alleleAccessionId,
    zygosity,
    parameterStableId,
    pipelineStableId,
    procedureStableId,
    phenotypingCentre,
    parameterName,
  } = props.value;

  let url = `/supporting-data?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameterStableId}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;
  if (isAssociatedToPWG) {
    url =
      "https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/";
  }
  if (procedureStableId.includes("IMPC_HIS")) {
    if (parameterName.includes("-")) {
      const tissue = parameterName.split("-")[0]?.trim().toLowerCase();
      url = `/supporting-data/histopath/${mgiGeneAccessionId}?anatomy=${tissue}`;
    } else {
      url = `/supporting-data/histopath/${mgiGeneAccessionId}`;
    }
  }
  return (
    <Link href={url}>
      <span className="link primary small float-right">Supporting data</span>
    </Link>
  );
};

export const SignificantPValueCell = <T extends GeneStatisticalResult>(
  props: TableCellProps<T> & {
    onRefHover?: (refNum: string, active: boolean) => void;
  }
) => {
  const { onRefHover = (p1, p2) => {} } = props;
  const pValue = _.get(props.value, props.field) as number;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;
  const isManualAssociation =
    props.value.status === "Successful" && pValue === 0;

  return (
    <span
      className="bold"
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <span data-testid="p-value">
        {!!pValue && props.value.status === "Successful" ? (
          formatPValue(pValue)
        ) : isManualAssociation ? (
          <>
            N/A{" "}
            <sup
              onMouseEnter={() => onRefHover("*", true)}
              onMouseLeave={() => onRefHover("*", false)}
            >
              *
            </sup>
          </>
        ) : (
          "N/A"
        )}
        &nbsp;
        {isAssociatedToPWG && (
          <sup
            onMouseEnter={() => onRefHover("**", true)}
            onMouseLeave={() => onRefHover("**", false)}
          >
            **
          </sup>
        )}
      </span>
    </span>
  );
};

export const MutantCountCell = <T extends GeneStatisticalResult>(
  props: TableCellProps<T> & {
    onRefHover?: (refNum: string, active: boolean) => void;
  }
) => {
  const { onRefHover = (p1, p2) => {} } = props;
  const { isNNumbersFootnoteAvailable } = useQueryFlags();
  const value = _.get(props.value, props.field) as string;
  const mutantsBelowThreshold =
    props.value.maleMutantCount < props.value.procedureMinMales &&
    props.value.femaleMutantCount < props.value.procedureMinFemales;
  return (
    <span
      style={props.style}
      onMouseEnter={() => onRefHover("+", true)}
      onMouseLeave={() => onRefHover("+", false)}
    >
      {value}
      {mutantsBelowThreshold && isNNumbersFootnoteAvailable && (
        <sup style={{ display: "inline-block", marginLeft: "5px" }}>+</sup>
      )}
    </span>
  );
};
