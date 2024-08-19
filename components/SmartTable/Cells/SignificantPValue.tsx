import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatPValue } from "@/utils";

const SignificantPValue = <T extends Model>(props: TableCellProps<T> & { onRefHover?: (refNum: string, active: boolean) => void }) => {
  const { onRefHover = (p1, p2) => {} } = props;
  const pValue = _.get(props.value, props.field) as number;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;

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
        {!!pValue
          ? formatPValue(pValue)
          : <>- <sup onMouseEnter={() => onRefHover("1", true)} onMouseLeave={() => onRefHover("1", false)}>[1]</sup></>
        }
        &nbsp;
        {isAssociatedToPWG && <span>*</span>}
      </span>
    </span>
  );
};

export default SignificantPValue;
