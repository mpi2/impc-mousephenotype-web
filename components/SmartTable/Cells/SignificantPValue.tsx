import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatPValue } from "@/utils";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const SignificantPValue = <T extends Model>(props: TableCellProps<T>) => {
  const pValue = _.get(props.value, props.field) as number;
  const mgiAccessionId = _.get(props.value, 'mgiGeneAccessionId') as string;
  const mpTermpId = _.get(props.value, 'id') as string;
  return (
    <span className="me-2 bold" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
      <span className="">
        {!!pValue ? formatPValue(pValue) : 0}&nbsp;
      </span>
      <Link href={`/data/charts?mgiGeneAccessionId=${mgiAccessionId}&mpTermId=${mpTermpId}`}>
        <strong className={`link primary small float-right`}>
          <FontAwesomeIcon icon={faChartLine} /> Supporting data&nbsp;
          <FontAwesomeIcon icon={faChevronRight} />
        </strong>
      </Link>
    </span>
  )
};

export default SignificantPValue;