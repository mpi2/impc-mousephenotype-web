import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatPValue } from "@/utils";

const SignificantPValue = <T extends Model>(props: TableCellProps<T>) => {
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
        {!!pValue ? formatPValue(pValue) : '-'}&nbsp;
        {isAssociatedToPWG && <span>*</span>}
      </span>
    </span>
  );
};

export default SignificantPValue;
