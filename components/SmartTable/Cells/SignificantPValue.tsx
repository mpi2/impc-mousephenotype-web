import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatPValue } from "@/utils";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const SignificantPValue = <T extends Model>(
  props: TableCellProps<T> & {
    mpTermIdKey?: keyof T;
  }
) => {
  const pValue = _.get(props.value, props.field) as number;
  const mgiAccessionId = _.get(props.value, "mgiGeneAccessionId") as string;
  const mpTermKey = !!props.mpTermIdKey ? props.mpTermIdKey : "id";
  const mpTermpId = _.get(props.value, mpTermKey) as string;
  let url = `/data/charts?mgiGeneAccessionId=${mgiAccessionId}&mpTermId=${mpTermpId}`;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;
  if (isAssociatedToPWG) {
    url =
      "https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/";
  }
  return (
    <span
      className="me-2 bold"
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <span data-testid="p-value">
        {!!pValue ? formatPValue(pValue) : 0}&nbsp;
        {isAssociatedToPWG && <span>*</span>}
      </span>
      <Link href={url}>
        <strong className={`link primary small float-right`}>
          <FontAwesomeIcon icon={faChartLine} /> Supporting data&nbsp;
          <FontAwesomeIcon icon={faChevronRight} />
        </strong>
      </Link>
    </span>
  );
};

export default SignificantPValue;
