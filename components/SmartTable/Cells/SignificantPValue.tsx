import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatPValue } from "@/utils";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChevronRight } from "@fortawesome/free-solid-svg-icons";


const SignificantPValue = <T extends Model>(
  props: TableCellProps<T> & { mpTermIdKey?: keyof T, linkToGrossPathChart?: boolean }
) => {
  const pValue = _.get(props.value, props.field) as number;
  const mgiAccessionId = _.get(props.value, 'mgiGeneAccessionId') as string;
  const mpTermKey = !!props.mpTermIdKey ? props.mpTermIdKey : 'id';
  const mpTermpId = _.get(props.value, mpTermKey) as string;
  let url = `/data/charts?mgiGeneAccessionId=${mgiAccessionId}&mpTermId=${mpTermpId}`;
  if (
    props.linkToGrossPathChart &&
    props.value?.['procedureStableId'].includes('IMPC_PAT') &&
    !!props.value?.['parameterStableId']
  ) {
    url = `/data/gross-pathology/${mgiAccessionId}/?grossPathParameterStableId=${props.value['parameterStableId']}`
  }
  const isAssociatedToPWG = props.value?.['projectName'] === 'PWG' || false;
  if (isAssociatedToPWG) {
    url = 'https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/';
  }
  return (
    <span className="me-2 bold" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
      <span className="">
        {!!pValue ? formatPValue(pValue) : 0}&nbsp;
        {isAssociatedToPWG && <span>*</span>}
      </span>
      <Link href={url} target="_blank">
        <strong className={`link primary small float-right`}>
          <FontAwesomeIcon icon={faChartLine} /> Supporting data&nbsp;
          <FontAwesomeIcon icon={faChevronRight} />
        </strong>
      </Link>
    </span>
  )
};

export default SignificantPValue;