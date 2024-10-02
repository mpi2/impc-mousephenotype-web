import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatPValue } from "@/utils";

const SignificantPValue = <T extends Model>(
  props: TableCellProps<T> & {
    onRefHover?: (refNum: string, active: boolean) => void;
  }
) => {
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
        {!!pValue ? (
          formatPValue(pValue)
        ) : (
          <>
            N/A{" "}
            <sup
              onMouseEnter={() => onRefHover("*", true)}
              onMouseLeave={() => onRefHover("*", false)}
            >
              *
            </sup>
          </>
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

export default SignificantPValue;
