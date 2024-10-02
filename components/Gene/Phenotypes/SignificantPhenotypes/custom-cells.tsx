import { TableCellProps } from "@/models";
import Link from "next/link";
import _ from "lodash";

type Props<T> = {
  mpTermIdKey?: keyof T;
} & TableCellProps<T>;
export const SupportingDataCell = <T,>(props: Props<T>) => {
  const numOfDatasets = _.get(props.value, props.field);
  const mgiAccessionId = _.get(props.value, "mgiGeneAccessionId") as string;
  const mpTermKey = !!props.mpTermIdKey ? props.mpTermIdKey : "id";
  const mpTermpId = _.get(props.value, mpTermKey) as string;

  let url = `/supporting-data?mgiGeneAccessionId=${mgiAccessionId}&mpTermId=${mpTermpId}`;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;
  if (isAssociatedToPWG) {
    url =
      "https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/";
  }
  return (
    <Link href={url}>
      <span className="link primary small float-right">
        {numOfDatasets === 1
          ? "1 supporting dataset"
          : `${numOfDatasets} supporting datasets`}
      </span>
    </Link>
  );
};
